import React, { useEffect, useState } from 'react';

function News() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [opinion, setOpinion] = useState(3);
  const [opinionSubmitted, setOpinionSubmitted] = useState(false);
  const [finish, setFinish] = useState(false); // MILLON LOPPUU?
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/news')
        .then(response => response.json())
        .then(data => {
          if (testCases.includes(data.testCaseId)) {
            // MITÄS NYT?
          }
          console.log(data);
          setContent(data)
        })
        .catch(error => {
          console.error('Error fetching news:', error)
          setError(error);
        });
  }, []);

  const handleSubmit = () => {
    const payload = {
      testCaseId: content.testCaseId,
      userOpinion: (opinion - 1) / 4
    };

    fetch('http://localhost:3001/opinion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        addTestCase(content.testCaseId);
        setOpinionSubmitted(true);
        console.log('Success:', data);
        //alert("Opinion submitted successfully!");
        setFinish(true);
        // KATO TÄÄ VIEL
        /* if (finish) {
          alert("Thank you for participating!")
        } else {
          fetch('http://localhost:3001/news')
          .then(response => response.json())
          .then(data => {
              setContent(data)
          })
          .catch(error => {
            console.error('Error fetching news:', error);
            setError(error);
          });
        } */
    })
    .catch(error => {
        console.error('Error:', error);
        //alert("Error submitting opinion!");
        setError(error.message);
    });
  };

  const addTestCase = (testCaseNumber) => {
    setTestCases((prevTestCases) => {
      if (prevTestCases.includes(testCaseNumber)) {
        return prevTestCases;
      }
      return [...prevTestCases, testCaseNumber];
    })
  }


  if (finish) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h1>Thank you for participating!</h1>
      </div>
    )
  }
  if (error) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h1>Error fetching the news</h1>
        <h2>Error message:</h2>
        {error.message}
      </div>
    )
  }
  if (!content) {
    return (
      <div style={{ padding: '1.5rem' }}>
      </div>
    )
  } else {
    return (
      <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {content.news.map((item, index) => (
                  <div 
                      key={item.newsId}
                      style={{ width: '20%', padding: '1.5rem', border: 'grey solid 1.5px', margin: '1rem', backgroundColor: 'whitesmoke' }}
                  >
                      <h3 style={{ textAlign: 'center', margin: '5px' }}>{item.header}</h3>
                      <p>{item.leadText}</p>
                  </div>
              ))}
          </div>
        <div style={{ textAlign: 'center', marginTop: '2rem'}}>
          <label style={{ fontSize: '24px' }}>What is your overall opinion on the mood of the news? (1-5)
              <br/>
              <span style={{ fontSize: '18px', color: 'grey' }}>1 = Negative, 2 = Slightly negative, 3 = Neutral, 4 = Slightly positive, 5 = Positive</span>
          </label>
          <br/>
          <p style={{ fontSize: '20px' }}>{opinion}</p>
          <input
            type="range"
            min="1"
            max="5"
            value={opinion}
            style={{ width: '33%' }}
            onChange={(e) => setOpinion(e.target.value)}
          />
          <br/>
          <button 
              style={{ padding: '8px', fontSize: '22px', backgroundColor: 'lightblue', fontWeight: '600', marginTop: '1rem' }}
              onClick={handleSubmit}
              disabled={opinionSubmitted}
          >
              Submit Opinion
          </button>
        </div>
      </div>
    );
  }
}


export default News;