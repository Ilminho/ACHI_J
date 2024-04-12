import News from "./News";

function App() {
  console.log("Rendering APP....");
  return (
    <div>
      <header style={{ borderBottom: 'grey solid 3px'}}>
        <h1 style={{ textAlign: 'center' }}>Sentiment Study</h1>
      </header>
      <News />
    </div>
  );
}

export default App;
