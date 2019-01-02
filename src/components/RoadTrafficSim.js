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
        cars: [],
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
        else if (e.target._id !== 1 && this.state.selectedNode === null && e.evt.shiftKey) { 
            this.setState(prevState => ({
                startNode: e.target.index,
                selectedNode: null
            }));
            window.console.log("Setting Selected Node");
            return;
        }
        else if (e.target._id !== 1 && this.state.selectedNode !== null && e.evt.shiftKey) { 
            this.setState(prevState => ({
                endNode: e.target.index,
                selectedNode: null
            }));
            window.console.log("Setting Selected Node");
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

    gameLoop = () => {
        var self = this;
        setInterval(function() {
            window.console.log(self.state);
            if (self.state.endNode !== null && self.state.startNode !== null && !self.state.cars.length) {
                window.console.log("empty cars");
                self.setState(prevState => ({
                    cars: [
                        {   
                            x: self.state.nodes[self.state.startNode].x, 
                            y: self.state.nodes[self.state.startNode].y, 
                            inTransit: false,
                            targetNode: self.state.startNode
                        }
                    ],
                }));
            }
            var nodes = self.state.nodes;
            let cars = self.state.cars;
            for (const [index, car] of cars.entries()) {
                if (car.inTransit === false) {
                    window.console.log("Car not in transit");
                    let shortestEdgeManhattanLength = 2147483647;
                    var newTargetNode = null;
                    for (var edge of self.state.edges) {
                        if (self.state.nodes[edge.node0].x === car.x && 
                            self.state.nodes[edge.node0].y === car.y && 
                            shortestEdgeManhattanLength > (Math.abs(self.state.nodes[edge.node1].x - self.state.nodes[edge.node0].x) 
                                                                + Math.abs(self.state.nodes[edge.node1].y - self.state.nodes[edge.node0].y))) {

                            shortestEdgeManhattanLength = (Math.abs(self.state.nodes[edge.node1].x - self.state.nodes[edge.node0].x) 
                                                                + Math.abs(self.state.nodes[edge.node1].y - self.state.nodes[edge.node0].y));
                            newTargetNode = nodes.findIndex(function(e) { return e.x == nodes[edge.node1].x && e.y == nodes[edge.node1].y; });
                            window.console.log(newTargetNode);
                        }
                    }
                    window.console.log(newTargetNode);
                    if (newTargetNode !== null) {
                        window.console.log("Car going in transit");
                        self.setState(state => {
                            const cars = state.cars.map((car, i) => {
                                if (i === index) {
                                    return {
                                        x: car.x, 
                                        y: car.y,
                                        inTransit: true,
                                        targetNode: newTargetNode
                                    };
                                } else {
                                    return car;
                                }
                            });

                            return {
                                cars,
                            };
                        });
                    }
                    window.console.log(self.state.cars);
                } else {
                    for (let node of self.state.nodes) {
                        if (node.x === car.x && node.y === car.y) {
                            self.setState(state => {
                                const cars = state.cars.map((car, i) => {
                                    if (i === index) {
                                        return {
                                            x: car.x, 
                                            y: car.y,
                                            inTransit: false,
                                            targetNode: car.targetNode
                                        };
                                    } else {
                                        return car;
                                    }
                                });

                                return {
                                    cars,
                                };
                            });
                        } else {
                            var distanceX = nodes[car.targetNode].x - car.x;
                            var distanceY = nodes[car.targetNode].y - car.y;
                            var newX = car.x;
                            var newY = car.y;

                            if (Math.abs(distanceY) > Math.abs(distanceX)) {
                                newY = distanceY < 0 ? --newY : ++newY;
                            } else {
                                newX = distanceX < 0 ? --newX : ++newX;
                            }


                            self.setState(state => {
                                const cars = state.cars.map((car, i) => {
                                    if (i === index) {
                                        return {
                                            x: newX, 
                                            y: newY,
                                            inTransit: true,
                                            targetNode: car.targetNode
                                        };
                                    } else {
                                        return car;
                                    }
                                });

                                return {
                                    cars,
                                };
                            });
                        }
                    }
                }
            }
        }, 42);
    }

    componentDidMount() {
        this.gameLoop();
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
                                            fill={i === this.state.selectedNode ? 'white' : i === this.state.startNode ? 'blue' : i === this.state.endNode ? 'red' : 'black'}
                                        />
                                    ))
                                }
                            </Group>
                        </Layer>
                        <Layer>
                            <Group>
                                {this.state.cars.map((node, i) => (
                                        <Rect
                                            id={i}
                                            key={i}
                                            onDragEnd={this.handleDragEnd} 
                                            x={node.x} 
                                            y={node.y}
                                            width={10}
                                            height={10}
                                            draggable
                                            fill={'yellow'}
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
