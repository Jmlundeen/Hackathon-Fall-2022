import './App.css';
import TempDisplay from './Display';
import TempInput from './Input';
import { useState } from 'react';

function App() {
	const [showDisplay, setShowDisplay] = useState(false);
	let currDisplay;
	let button;
	if (showDisplay) {
		currDisplay = <TempDisplay />;
		button = (
			<button onClick={() => setShowDisplay(false)}>change display</button>
		);
	} else {
		currDisplay = <TempInput />;
		button = (
			<button onClick={() => setShowDisplay(true)}>change display</button>
		);
	}
	return (
		<>
			<header className="App-header">
				<div className="App">
					{currDisplay}
					{button}
				</div>
			</header>
		</>
	);
}

export default App;
