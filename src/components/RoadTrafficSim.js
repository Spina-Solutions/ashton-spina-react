import React, { Component } from 'react';
import Background from './textures/desertGrass.jpg';
import { Stage, Group, Layer, Rect, Line } from 'react-konva';
import Konva from 'konva';

class ColoredRect extends React.Component {
    constructor(...args) {
        super(...args);
        const image = new window.Image();
      image.onload = () => {
        this.setState({
          fillPatternImage: image
        });
      }
      image.src = require('../images/car_small.png');
      this.state = {
        color: 'green',
        fillPatternImage: null
      };
    }

    state = {
        color: Konva.Util.getRandomColor()
    };

    render() {
        return (
        <Rect
            x={this.props.x}
            y={this.props.y}
            width={12}
            height={24}
            shadowBlur={5}  
            fillPatternImage={this.state.fillPatternImage}
            onClick={this.handleClick}
        />
    );
  }
}

class RoadTrafficSim extends Component {

    state = {
        cars: [],
        nodes: [{x: -100, y: 300}, {x: 100, y: 300}, {x: window.innerWidth - 100, y: 300}, {x: window.innerWidth + 100, y: 300}],
        edges: [{node0: 0, node1: 1}, {node0: 2, node1: 3}],
        selectedNode: null,
        startNode: 0,
        endNode: 3,
        lastCar: new Date().getTime()
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
            return;
        }
        else if (e.target._id !== 1 && this.state.selectedNode === null && e.evt.shiftKey) { 
            this.setState(prevState => ({
                startNode: e.target.index,
                selectedNode: null
            }));
            return;
        }
        else if (e.target._id !== 1 && this.state.selectedNode !== null && e.evt.shiftKey) { 
            this.setState(prevState => ({
                endNode: e.target.index,
                selectedNode: null
            }));
        } 
        // Haven't selected a node yet
        else if (this.state.selectedNode === null && e.target._id !== 1) { 
            this.setState(prevState => ({
                selectedNode: e.target.index
            }));
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
            return;
        }
        else {
            this.setState(prevState => ({
                selectedNode: null
            }));
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
    } 

    gameLoop = () => {
        var self = this;
        setInterval(function() {
            if (self.state.endNode !== null && 
                self.state.startNode !== null && 
                self.state.cars.length < 25 && 
                new Date().getTime() - self.state.lastCar > ((Math.random() * 2000) + 1000)) {

                self.setState(prevState => ({
                    cars: self.state.cars.concat([
                        {   
                            x: self.state.nodes[self.state.startNode].x + 10, 
                            y: self.state.nodes[self.state.startNode].y + 10,
                            dX: 0,
                            dY: 0,
                            inTransit: false,
                            sourceNode: self.state.startNode,
                            targetNode: null,
                            speedScalar: 1
                        }
                    ]),
                    lastCar: new Date().getTime()
                }));
            }
            self.setState({cars: self.state.cars.filter(car => car !== null)});
            var nodes = self.state.nodes;
            let cars = self.state.cars;
            for (let [index, car] of cars.entries()) {
                if (car === null) continue;
                // Car not moving so find a place to go
                if (car.inTransit === false) {
                    let shortestEdgeManhattanLength = Number.MAX_SAFE_INTEGER;
                    var newTargetNode = null;
                    // Find new target node
                    for (var edge of self.state.edges) {
                        if (self.state.nodes[edge.node0].x === self.state.nodes[car.sourceNode].x && 
                            self.state.nodes[edge.node0].y === self.state.nodes[car.sourceNode].y && 
                            shortestEdgeManhattanLength > (Math.abs(self.state.nodes[edge.node1].x - self.state.nodes[edge.node0].x) 
                                                                + Math.abs(self.state.nodes[edge.node1].y - self.state.nodes[edge.node0].y))) {

                            shortestEdgeManhattanLength = (Math.abs(self.state.nodes[edge.node1].x - self.state.nodes[edge.node0].x) 
                                                                + Math.abs(self.state.nodes[edge.node1].y - self.state.nodes[edge.node0].y));
                            newTargetNode = nodes.findIndex(function(e) { return e.x === nodes[edge.node1].x && e.y === nodes[edge.node1].y; });
                        }
                    }
                    // Set new target node
                    if (newTargetNode !== null) {
                        self.setState(state => {
                            const cars = state.cars.map((car, i) => {
                                if (i === index) {
                                    return {
                                        x: car.x, 
                                        y: car.y,
                                        dX: car.dX,
                                        dY: car.dY,
                                        inTransit: true,
                                        sourceNode: car.targetNode !== null ? car.targetNode : car.sourceNode,
                                        targetNode: newTargetNode,
                                        speedScalar: 1
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
                // Car is moving so continue its path
                } else {
                    for (const [key, node] of nodes.entries()) {
                        // Check if car has arrived at a node
                        if (car !== null &&
                                car.inTransit &&
                                key !== car.sourceNode && 
                                (Math.abs(node.x + 10 - car.x) < 22 && Math.abs(node.y + 10 - car.y) < 22)) {
                            self.setState(state => {
                                const cars = state.cars.map((car, i) => {
                                    // If car has arrived at end node remove it
                                    if (key === state.endNode && index === i) {
                                        return null;
                                    }
                                    if (i === index) {
                                        return {
                                            x: car.x, 
                                            y: car.y,
                                            dX: car.dX,
                                            dY: car.dY,
                                            inTransit: false,
                                            sourceNode: car.targetNode,
                                            targetNode: car.targetNode,
                                            speedScalar: 1
                                        };
                                    } else {
                                        return car;
                                    }
                                });
                                return {
                                    cars,
                                };
                            });
                            car = null;
                        }
                    }
                    // If car has not been removed and it is currently in transit
                    if (car !== null && car.inTransit) {
                        var distanceX = nodes[car.targetNode].x + 10 - car.x;
                        var distanceY = nodes[car.targetNode].y + 10 - car.y;
                        var newX = car.x;
                        var newY = car.y;

                        // move in normalized direction vector
                        let normalizationScalar = Math.sqrt(distanceY * distanceY + distanceX * distanceX);

                        let dX = distanceX / normalizationScalar;
                        let dY = distanceY / normalizationScalar;


                        let speedScalar = 1;
                        let maxScalar = 1;
                        // Calculate car speed
                        for (const [key, obstructingCar] of cars.entries()) {
                            if (key === index || obstructingCar === null) {
                                continue;
                            }
                            let diffX = car.x - obstructingCar.x;
                            let diffY = car.y - obstructingCar.y;
                            let innerNormalizer = Math.sqrt(diffY * diffY + diffX * diffX);
                            let toCarX = diffX / innerNormalizer;
                            let toCarY = diffY / innerNormalizer;
                            let dotProductDiff = (dX * toCarX) + (dY * toCarY);

                            if (!isNaN(dotProductDiff) && dotProductDiff < 0 && dotProductDiff < -0.8) {
                                let euclidianDistance =  Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                                speedScalar = euclidianDistance / 60;
                                maxScalar = euclidianDistance < 30 ? 0 : speedScalar < maxScalar ? speedScalar : maxScalar;
                            }
                        }
                        // Change direction by limited amount
                        normalizationScalar = normalizationScalar === 0 ? 0.000001 : normalizationScalar;
                        let XNormalizer = Math.abs(car.dX - dX);
                        XNormalizer = XNormalizer === 0 ? 0.000001 : XNormalizer;
                        let YNormalizer = Math.abs(car.dY - dY);
                        YNormalizer = YNormalizer === 0 ? 0.000001 : YNormalizer;

                        // Set new position
                        XNormalizer = 1 - XNormalizer / 2;
                        YNormalizer = 1 - YNormalizer / 2;

                        dX = ((car.dX * (0.97)) + (dX * 0.03)) * maxScalar;
                        dY = ((car.dY * (0.97)) + (dY * 0.03)) * maxScalar;
                        newX += dX;
                        newY += dY;
                        
                        self.setState(state => {
                            const cars = state.cars.map((car, i) => {
                                if (i === index) {
                                    return {
                                        x: newX, 
                                        y: newY,
                                        dX: dX,
                                        dY: dY,
                                        inTransit: true,
                                        sourceNode: car.sourceNode,
                                        targetNode: car.targetNode,
                                        speedScalar: 1
                                    };
                                } else {
                                    return car;
                                }
                            });

                            return {
                                cars,
                            };
                        });

                        // Set rotation by getting angle from direction vector
                        if (self.stage.children[2].children[0] && self.stage.children[2].children[0].children[index] !== undefined) {
                            let radians = Math.atan2(dY, dX); //radians
                            // you need to divide by PI, and MULTIPLY by 180:
                            let degrees = 180 * radians / Math.PI;  //degrees
                            let angle = 90 + (360 + Math.round(degrees)) % 360; //round number, avoid decimal fragments
                            self.stage.children[2].children[0].children[index].setRotation(angle);
                            self.stage.children[2].children[0].children[index].setOffset({x: 6, y: 12});
                        }
                    }
                }
            }
        }, 16.6666667);
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
                        ref={stage => {
                            this.stage = stage;
                        }}
                    >
                        <Layer>
                            <Group>
                                {this.state.edges.map((edge, i) => (
                                    <Line 
                                        id={i}
                                        key={i} 
                                        strokeWidth = {20}
                                        stroke = 'grey'
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
                                {this.state.cars.filter(car => car !== null).map((car, i) => (
                                    <ColoredRect
                                        id={i}
                                        key={i}
                                        x={car.x} 
                                        y={car.y}
                                    />
                                ))}
                            </Group>
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }
    
}

export default RoadTrafficSim;
