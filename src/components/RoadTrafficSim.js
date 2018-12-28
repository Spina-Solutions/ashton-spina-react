import React, { Component } from 'react';
import Background from './textures/desertGrass.jpg';
import Square from './textures/square.png';
import { Stage, Group, Layer, Rect, Line, Text } from 'react-konva';
import Konva from 'konva';

class ColoredRect extends React.Component {
    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    state = {
        color: Konva.Util.getRandomColor()
    };

    render() {
        return (
        <Rect
            x={this.props.x}
            y={this.props.y}
            width={20}
            height={20}
            draggable
            fill={this.state.color}
            onClick={this.handleClick}
        />
    );
  }
}

class RoadTrafficSim extends Component {

    state = {
        nodes: [],
        edges: [],
        selectedNode: null,
        startNode: null,
        endNode: null
    };

    handleClick = (e) => {
        //console.log('native event', e.evt);
        //console.log('Konva.Circle instance', e.target);
        //console.log('mouse position on canvas', e.target.getStage());
        
        // Clicked on the stage so create a new node
        if (e.target._id === 1 && e.evt.shiftKey) { 
            this.setState(prevState => ({
                nodes: [...prevState.nodes, {x: e.target.getStage().getPointerPosition().x, y: e.target.getStage().getPointerPosition().y}]
            }));
            window.console.log("Creating Node");
            return;
        }
        // Haven't selected a node yet
        else if (this.state.selectedNode === null && e.target._id !== 1) { 
            this.setState(prevState => ({
                selectedNode: e.target.index
            }));
            window.console.log("Setting Selected Node");
            return;
        }
        // Add an edge because a node is already selected and we've clicked on one
        else if(this.state.selectedNode !== null && e.target._id !== 1 && this.state.selectedNode !== e.target.index) {
            // TODO:: Check if the edge already exists
            if(true) {
                this.setState(prevState => ({
                    edges: [...prevState.edges, {node0: this.state.selectedNode, node1: e.target.index}],
                    selectedNode: null
                }));
            }   
            window.console.log("Adding Edge");
            return;
        }
        else {
            this.setState(prevState => ({
                selectedNode: null
            }));
            window.console.log("Resetting Selected Node");
            return;
        }
        //window.console.log(e.target._id);
        //window.console.log(e.target.index);
        //window.console.log(this.state);
    }

    handleDragEnd = (e) => {
        this.setState(state => {
            const nodes = state.nodes.map((node, i) => {
                if (e.target.index === i) {
                    return {x: e.target.getStage().getPointerPosition().x, y: e.target.getStage().getPointerPosition().y};
                } else {
                    return node;
                }
            });

            return {
                nodes,
            };
        });
        window.console.log(this.state);
    }   

    render(props, context) {
        const styles = {
            root: {
                flexGrow: 1
            },
            simDiv: {
                backgroundColor: 'green',
                backgroundImage: `url(${Background})`,
                backgroundRepeat: 'repeat'
            }
        };

        return (
            <div style={styles.root}>
                <div style={styles.simDiv}>
                    <Stage
                        width={window.innerWidth} 
                        height={window.innerHeight}
                        listening
                        onClick={this.handleClick}
                    >
                        <Layer>
                            <Group>
                                {this.state.edges.map((edge, i) => (
                                    <Line 
                                        id={i}
                                        key={i} 
                                        strokeWidth = {20}
                                        stroke = 'black'
                                        opacity = {0.7}
                                        points ={[this.state.nodes[edge.node0].x + 10, this.state.nodes[edge.node0].y + 10, this.state.nodes[edge.node1].x + 10, this.state.nodes[edge.node1].y + 10]}
                                    />
                                ))}
                            </Group>
                        </Layer>
                        <Layer>
                            <Group>
                                {this.state.nodes.map((node, i) => (
                                        <Rect
                                            id={i}
                                            key={i}
                                            onDragEnd={this.handleDragEnd} 
                                            x={node.x} 
                                            y={node.y}
                                            width={20}
                                            height={20}
                                            draggable
                                            fill={i === this.state.selectedNode ? 'white' : 'black'}
                                        />
                                    ))
                                }
                            </Group>
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }
    
}

export default RoadTrafficSim;