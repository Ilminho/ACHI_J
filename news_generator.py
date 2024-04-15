"""
This script should work on a 12GB GPU.
The device should be run on Linux, since Windows support is limited.
Should the GPU have too little room, then set device="cpu"
"""
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from transformers.generation import GenerationConfig
import torch
import re
import pprint
import json
import random
import uuid

# Choosing device
device = "cuda:0"
print(f"Using device: {device}")

# LLM model init
llm_model_name = "NousResearch/Llama-2-7b-chat-hf"
system_prompt = "You're an AI assistant that tries to help the user as much as you can."
tokenizer = AutoTokenizer.from_pretrained(llm_model_name)
model = AutoModelForCausalLM.from_pretrained(
	llm_model_name,
	device_map=device,
	load_in_4bit=True
)

# Sentiment analysis
sentiment_analyzer = pipeline("sentiment-analysis")

# Global variables
sentiments = ["negative", "positive"]

# Generate response from prompt and parse only the response
def generate_response(prompt):
	model_inputs = tokenizer(
		[prompt],
		return_tensors="pt",
		return_token_type_ids=False,
	)

	generated_ids = model.generate(
		**model_inputs,
		min_length=1,
		max_new_tokens=100000,
		do_sample=True
	)

	# Parse away eveything else but the bot's response

	response = tokenizer.batch_decode(generated_ids)[0]

	response = response.split("[/INST]")
	response = response[len(response) - 1]
	response.replace("\t","")

	return response
	
if __name__ == "__main__":


	num_tests = 7
	news_per_test = 6

	final_json = {
		"tests": []
	}

	# Get the topics
	with open("topics.txt", "r") as f:
		topics = f.readlines()

	for i in range(len(topics)):
		topics[i] = topics[i].replace("\n", "")


	for j in range(num_tests):

		caseId = str(uuid.uuid4())

		test_case = {}
		test_case["testcaseId"] = caseId
		test_case["content"] = []
		test_case["sentimentEstimate"] = None
		test_case["humanEstimate"] = []
		test_case["averageHumanEstimate"] = None

		true_pos = 0
		sentiment_est = 0

		# Generate test cases
		for i in range(news_per_test):

			# Generate news
			subject = random.choice(topics)
			sentiment = random.choice(sentiments)

			question = f"Generate a news headline and a lead to a news about {subject} in a {sentiment} tone"

			prompt =	f"""
					<s>[INST] <<SYS>>
					{system_prompt}

					{question}

					Give the answer the the following format:
					Headline:
					Lead:

					Both the lead and the headline should be in quotes
					[/INST]
					"""

			prompt.replace("\t", "")


			response = generate_response(prompt)
			response = response.replace("\t", "")
			response = response.replace("Headline:", "")
			response = response.replace("Lead:", "")
			response = response.replace("</s>", "")
			response = response.replace("\"", "")

			sentiment = sentiment_analyzer(response)

			response = response.split("\n")

			news = {}
			
			texts = []
			for s in response:
				if (len(texts) == 2):
					break
				if (s != ""):
					texts.append(s.strip())
			news["newsId"] = str(uuid.uuid4())
			news["header"] = texts[0]
			news["leadText"] = texts[1]

			if (sentiment[0]["label"] == "POSITIVE"):
				sent = True
				true_pos += 1
				sentiment_est += sentiment[0]["score"]
			else:
				sent = False
				sentiment_est += 1 - sentiment[0]["score"]

			news["isPositive"] = sent

			test_case["content"].append(news)

		test_case["truePositiveness"] = true_pos / news_per_test
		test_case["sentimentEstimate"] = sentiment_est / news_per_test

		final_json["tests"].append(test_case)

	pprint.pp(final_json)

	json_obj = json.dumps(final_json, indent=4)
	with open("TestCase.json", "w") as f:
		f.write(json_obj)