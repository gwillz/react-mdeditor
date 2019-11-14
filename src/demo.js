
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Editor } from '../build/Editor';

function Demo() {
    const [value, onValue] = useState("");
    
    return React.createElement(Editor, {
        value,
        onValue,
    });
}

ReactDOM.render(React.createElement(Demo), document.getElementById("root"));
