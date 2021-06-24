import logo from './logo.svg';
import './App.css';
import ReactHorizontalScroll from './react-horizontal-scroll';

function App() {
  return (
    <div className="App">
      <ReactHorizontalScroll>
        <div class="block">
          <h2>Item 1</h2>
        </div>

        <div class="block">
          <h2>Item 2</h2>
        </div>

        <div class="block">
          <h2>Item 3</h2>
        </div>

        <div class="block">
          <h2>Item 4</h2>
        </div>

        <div class="block">
          <h2>Item 5</h2>
        </div>

        <div class="block">
          <h2>Item 6</h2>
        </div>

        <div class="block">
          <h2>Item 7</h2>
        </div>

        <div class="block">
          <h2>Item 8</h2>
        </div>
      </ReactHorizontalScroll>
    </div>
  );
}

export default App;
