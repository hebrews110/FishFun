import ReactDOM from 'react-dom';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import useForceUpdate from 'use-force-update'

function firstCapitalized(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function slugify(str) {
    return str.replace(/ /g, '_');
}

const infoParagraphs = {
    "mouth": {
        "on bottom": "sometimes has teeth; bottom feeder; strong biter",
        "on top": "sometimes has teeth; feeds on surface; feeds on prey above",
        "in front": "has teeth; biter, nibbler, or picker" 
    },
    "body": {
        "ribbon": "slow swimmer but moves easily through cracks in rocks",
        "compressed": "flattened on the sides; easy to manuever through tight turns",
        "fusiform": "built for speed and continuous swimming",
        "sphere": "rounded; slow mover"
    },
    "tail": {
        "lunate": "crescent shaped; fastest tail",
        "forked": "V-shaped; moderately fast",
        "tapered": "best for swimming slowly and accurately",
        "rounded": "capable of short bursts of speed over long distances",
        "squared": "capable of bursts of speed for short distances"
    }
};

const pointValues = {
    "mouth": {
        "on bottom": 1,
        "on top": 1,
        "in front": 3
    },
    "body": {
        "ribbon": 1,
        "compressed": 2,
        "fusiform": 3,
        "sphere": 2
    },
    "tail": {
        "lunate": 3,
        "forked": 3,
        "tapered": 1,
        "rounded": 1,
        "squared": 1
    }
};

window.onload = () => {
    function FishImageBox({ category, info, gameDone, handleCategoryChange }) {
        const type = info[category];
        const selectOptions = {
            "mouth": [
                <MenuItem key={1} value="on bottom">On bottom</MenuItem>,
                <MenuItem key={2} value="on top">On top</MenuItem>,
                <MenuItem key={3} value="in front">In front</MenuItem>,
            ],
            "body": [
                <MenuItem key={4} value="fusiform">Fusiform</MenuItem>,
                <MenuItem key={5} value="ribbon">Ribbon</MenuItem>,
                <MenuItem key={6} value="sphere">Sphere</MenuItem>,
                <MenuItem key={7} value="compressed">Compressed</MenuItem>,
            ],
            "tail": [
                <MenuItem key={8} value="forked">Forked</MenuItem>,
                <MenuItem key={9} value="lunate">Lunate</MenuItem>,
                <MenuItem key={10} value="rounded">Rounded</MenuItem>,
                <MenuItem key={11} value="squared">Squared</MenuItem>,
            ]
        };
        return <div className="fish-box">
            <div className="fish-image-box-controls fish-image-box-top-controls">
                <div className="fish-image-box-name">
                    <FormControl>
                        <InputLabel>{firstCapitalized(category)} type</InputLabel>
                        <Select disabled={gameDone} value={type} onChange={handleCategoryChange?.bind(this, category)}>
                            {selectOptions[category]}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={`fish-image-box fish-${category}`}>
                <img src={`images/${category}_${slugify(type)}.png`}/>
            </div>
            <div className="fish-image-box-controls fish-image-box-bottom-controls">
                <div className="fish-image-box-name">
                    {infoParagraphs[category][type]}
                </div>
            </div>
        </div>
    }

    function App() {
        const fishTypes = React.useRef({
            mouth: "on bottom",
            body: "fusiform",
            tail: "lunate"
        });
        const forceUpdate = useForceUpdate();
        const [ showCheckIndicator, setShowCheckIndicator ] = React.useState(false);
        const [ whoLives, setWhoLives ] = React.useState(false);
        const handleCategoryChange = (category, e) => {
            fishTypes.current[category] = e.target.value;
            setShowCheckIndicator(false);
            forceUpdate();
        };
        React.useEffect(() => {
            Swal.fire({
                title: 'Instructions',
                text: 'Build an ideal fish for the open ocean. Click on the dropdown arrows to choose the best parts to build your fish with.',
                confirmButtonText: 'Start'
            });
        }, []);
        let pointsValue = 0;
        Object.keys(fishTypes.current).forEach(key => pointsValue += pointValues[key][fishTypes.current[key]]);
        console.log(pointsValue);
        let imageSource = null, textResult = null;
        const gameDone = showCheckIndicator && (pointsValue >= 8);
        if(gameDone) {
            imageSource = "images/happyfish.png";
            textResult = "Healthy fish";
        } else if(pointsValue >= 5) {
            imageSource = "images/sadfish.svg";
            textResult = "Sick fish";
        } else {
            imageSource = "images/deadfish.png";
            textResult = "Dead fish";
        }
        return <>
            {!whoLives && <div className="fish" style={{display: gameDone ? 'none' : null }}>
                <FishImageBox gameDone={gameDone} category="mouth" info={fishTypes.current} handleCategoryChange={handleCategoryChange}/>
                <FishImageBox gameDone={gameDone} category="body" info={fishTypes.current} handleCategoryChange={handleCategoryChange}/>
                <FishImageBox gameDone={gameDone} category="tail" info={fishTypes.current} handleCategoryChange={handleCategoryChange}/>
            </div>}
            {!whoLives && <img key="same-old-fish-image" className={`fish-indicator ${gameDone ? "fish-indicator-grow" : ""}`} style={{display: showCheckIndicator ? null : 'none' }} src={imageSource}/>}
            {showCheckIndicator && <h1>Result: {textResult}</h1>}
            {(!whoLives && !showCheckIndicator) && <button style={{display: gameDone ? 'none' : null }} className="check-button" onClick={setShowCheckIndicator.bind(this, true)} disabled={showCheckIndicator}>Check me!</button>}
            {!whoLives && <button style={{display: gameDone ? 'none' : null }} className="check-button" onClick={setWhoLives.bind(this, true)}>Who lives in the open ocean?</button>}
            {whoLives && <h1>Tuna fish</h1>}
            {whoLives && <img className="fish-indicator" src="images/tuna.svg"/>}
            {whoLives && <button style={{display: gameDone ? 'none' : null }} className="check-button" onClick={setWhoLives.bind(this, false)}>Go back</button>}
        </>;
    }
    ReactDOM.render(<App/>, document.getElementById('game-container'));
};