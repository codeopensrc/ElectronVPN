"use strict";

import React from 'react';
import DOM from 'react-dom';

class Input extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {}

    handleChange(e) {
        this.props.onChange(e.target.value)
    }

    render() {

        let style = {
            width: 200,
            height: 20,
            fontSize: "20px"
        }

        return (
            <div>
                <input style={style} onChange={this.handleChange} placeholder={this.props.placeholder}/>
            </div>
        );
    }

}

module.exports = Input
