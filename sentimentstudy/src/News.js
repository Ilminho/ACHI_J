import React, { useEffect, useState } from 'react';

function News() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [opinion, setOpinion] = useState(3);
  const [finished, setFinished] = useState(false);
  const [colorsHighlighted, setColorsHighlighted] = useState(false);


  useEffect(() => {
    fetch('http://localhost:3001/testcase')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.finished) {
          setFinished(true);
        } else {
          randomizeColors();
          setContent(data);
        }
      })
      .catch(error => {
        console.error('Error fetching news:', error)
        setError(error);
      });
  }, []);

  const randomizeColors = () => {
    let randInt = Math.random() * 10;
    console.log(randInt);
    if (randInt <= 5) {
      setColorsHighlighted(true);
    } else {
      setColorsHighlighted(false);
    }
  }

  const handleSubmit = () => {
    console.log("Submitting opinion...");
    const payload = {
      testCaseId: content.testcaseId,
      opinion: (opinion - 1) / 4,
      colorsHighlighted: colorsHighlighted,
    };

    fetch('http://localhost:3001/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        setColorsHighlighted(false);
        setOpinion(3);
        fetch('http://localhost:3001/testcase')
          .then(response => response.json())
          .then(data => {
            if (data.finished) {
              console.log("Finished");
              setFinished(true);
            } else {
              randomizeColors();
              setContent(data)
            }
          })
          .catch(error => {
            console.error('Error fetching news:', error);
            setError(error);
          });
      })
      .catch(error => {
        console.error('Error submitting opinion:', error);
        setError(error);
      });
  };

  const handleReset = () => {
    const payload = {
      resetTestcases: true
    }
    setContent(null);
    setError(null);
    setOpinion(3);
    setFinished(false);
    setColorsHighlighted(false);

    fetch('http://localhost:3001/resetTestcases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.resetSuccess) {
          console.log("Testcases reset");
          fetch('http://localhost:3001/testcase')
            .then(response => response.json())
            .then(data => {
              console.log(data);
              randomizeColors();
              setContent(data);
            })
            .catch(error => {
              console.error('Error fetching news:', error)
              setError(error);
            });
        } else {
          console.log("Error in reset");
        }
      })
  }

  const handleHardReset = () => {
    const payload = {
      resetHard: true
    }
    setContent(null);
    setError(null);
    setOpinion(3);
    setFinished(false);
    setColorsHighlighted(false);

    fetch('http://localhost:3001/resetHard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.resetSuccess) {
          console.log("Hard reset complete");
          fetch('http://localhost:3001/testcase')
            .then(response => response.json())
            .then(data => {
              console.log(data);
              randomizeColors();
              setContent(data);
            })
            .catch(error => {
              console.error('Error fetching news:', error)
              setError(error);
            });
        } else {
          console.log("Error in reset");
        }
      })
  }

  if (error) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h1>Error</h1>
        <h2>Error message:</h2>
        {error.message}
      </div>
    )
  }
  if (finished) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h1>Thank you for participating!</h1>
        <button
          style={{ padding: '8px', fontSize: '22px', backgroundColor: 'lightblue', fontWeight: '600', marginTop: '1rem' }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    )
  } else if (!content) {
    return (
      <div style={{ padding: '1.5rem' }}>
      </div>
    )
  } else {
    return (
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '1rem' }}>
          {/* Left column */}
          <div style={{width: '25%' }}>
            {/* 1. news */}
            <div 
              style={{
                padding: '0.5rem',
                backgroundColor: colorsHighlighted && !content.content[0].isPositive ? 'black' : '',
                color: colorsHighlighted && !content.content[0].isPositive ? 'white' : '',
              }}
            >
              <h3 style={{ margin: '5px 0 5px 0' }}>{content.content[0].header}</h3>
              <p>{content.content[0].leadText}</p>
            </div>
            <hr/>
            {/* AD */}
            <div style={{ height: '7rem', backgroundColor: 'grey', padding: '3rem' }}>
              <h1 style={{ textAlign: 'center' }}>Ad</h1>
            </div>
            <hr/>
            {/* 2. news */}
            <div
              style={{
                padding: '0.5rem',
                backgroundColor: colorsHighlighted && !content.content[1].isPositive ? 'black' : '',
                color: colorsHighlighted && !content.content[1].isPositive ? 'white' : '',
              }}
            >
              <h3 style={{ margin: '5px 0 5px 0' }}>{content.content[1].header}</h3>
              <p>{content.content[1].leadText}</p>
            </div>
          </div>
          <div style={{ width: '0px', border: '1px black solid' }}></div>
          {/* Middle column */}
          <div style={{ width: '35%'}}>
            {/* Ad/Image? */}
            <div style={{ height: '14rem', backgroundColor: 'grey', padding: '5rem' }}>
              <h1 style={{ textAlign: 'center' }}>Image</h1>
            </div>
            <hr/>
            {/* 3. news */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.5rem',
                backgroundColor: colorsHighlighted && !content.content[2].isPositive ? 'black' : '',
                color: colorsHighlighted && !content.content[2].isPositive ? 'white' : '',
              }}
            >
              <h3 style={{ margin: '5px 0 5px 0' }}>{content.content[2].header}</h3>
              <p>{content.content[2].leadText}</p>
            </div>
          </div>
          <div style={{ width: '0px', border: '1px black solid' }}></div>
          {/* Right column */}
          <div style={{ width: '25%' }}>
            {/* 4. news */}
            <div
              style={{
                padding: '0.5rem',
                backgroundColor: colorsHighlighted && !content.content[3].isPositive ? 'black' : '',
                color: colorsHighlighted && !content.content[3].isPositive ? 'white' : '',
              }}
            >
              <h3 style={{ margin: '5px 0 5px 0' }}>{content.content[3].header}</h3>
              <p>{content.content[3].leadText}</p>
            </div>
            <hr/>
            {/* 5. news */}
            <div
              style={{
                padding: '0.5rem',
                backgroundColor: colorsHighlighted && !content.content[4].isPositive ? 'black' : '',
                color: colorsHighlighted && !content.content[4].isPositive ? 'white' : '',
              }}
            >
              <h3 style={{ margin: '5px 0 5px 0' }}>{content.content[4].header}</h3>
              <p>{content.content[4].leadText}</p>
            </div>
            <hr/>
            {/* 6. news */}
            <div
              style={{
                padding: '0.5rem',
                backgroundColor: colorsHighlighted && !content.content[5].isPositive ? 'black' : '',
                color: colorsHighlighted && !content.content[5].isPositive ? 'white' : '',
              }}
            >
              <h3 style={{ margin: '5px 0 5px 0' }}>{content.content[5].header}</h3>
              <p>{content.content[5].leadText}</p>
            </div>
          </div>
        </div>
        <hr style={{ margin: '1rem'}}/>
        <div style={{ textAlign: 'center', marginTop: '2rem'}}>
          <label style={{ fontSize: '24px' }}>What is your overall opinion on the mood of the news? (1-5)
              <br/>
              <span style={{ fontSize: '18px', color: 'grey' }}>1 = Negative, 2 = Slightly negative, 3 = Neutral, 4 = Slightly positive, 5 = Positive</span>
          </label>
          <br/>
          <h1 style={{ margin: '0.5rem' }}>{opinion}</h1>
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
              style={{ padding: '8px', fontSize: '22px', backgroundColor: 'white', fontWeight: '600', marginTop: '1rem' }}
              onClick={handleSubmit}
          >
              Submit Opinion
          </button>
          <button
            style={{ padding: '8px', fontSize: '22px', backgroundColor: 'white', fontWeight: '600', marginTop: '1rem' }}
            onClick={handleHardReset}
          >
            Devving hard reset
          </button>
        </div>
      </div>
    );
  }
}


export default News;