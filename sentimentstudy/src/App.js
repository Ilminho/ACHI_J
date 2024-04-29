import News from "./News";

function App() {
  return (
    <div>
      <header style={{ borderBottom: 'grey solid 1px'}}>
        <h1 style={{ textAlign: 'center', margin: '0.6rem 0 0.5rem 0' }}>Sentiment Study</h1>
      </header>
      <News />
    </div>
  );
}

export default App;
