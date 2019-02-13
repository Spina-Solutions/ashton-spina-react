import React, { Component } from 'react';
import Background from './textures/grassTest.jpg';
import { Stage, Group, Layer, Rect, Line, Circle, Tag, Text, Label } from 'react-konva';
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
        color: 'yellow',
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
            offset={this.props.offset}
            rotation={this.props.rotation}
            width={12}
            height={24}
            shadowBlur={5}  
            fillPatternImage={this.state.fillPatternImage}
        />
    );
  }
}

class ColoredLine extends React.Component {
    constructor(...args) {
        super(...args);
        const image = new window.Image();
        image.onload = () => {
            this.setState({
                fillPatternImage: image
            });
        }
        image.src = require('./textures/grassTest.jpg');
        this.state = {
            color: 'grey',
            fillPatternImage: null
        };
    }

    render() {
        return (
            <Line
                strokeWidth = {24}
                fillPatternImage = {this.state.fillPatternImage}
                opacity = {1}
                points = {this.props.points}
                fillPatternRepeat = {'repeat'}
                fillPriority = {'pattern'}
                lineCap = {'round'}
            />
        );
    }
}

class RoadTrafficSim extends Component {

    state = {
        cars: [],
        nodes: [{x: -100, y: 300, size: 1}, {x: 100, y: 300, size: 1}, {x: window.innerWidth - 100, y: 300, size: 1}, {x: window.innerWidth + 100, y: 300, size: 1}],
        edges: [{node0: 0, node1: 1}, {node0: 2, node1: 3}],
        selectedNode: null,
        startNode: 0,
        endNode: 3,
        lastCar: window.performance.now(),
        lastRender: window.performance.now(),
    };

    handleClick = (e) => {
        // Handle possible click scenarios
        if (e.target.nodeType === 'Stage' && e.evt.shiftKey) { 
            window.console.log("Made Node");
            this.setState(prevState => ({
                nodes: [...prevState.nodes, {x: e.target.getStage().getPointerPosition().x - 10, y: e.target.getStage().getPointerPosition().y - 10, size: 1}]
            }));
            return;
        }
        else if (e.target.attrs.id !== undefined) {
            if (e.target.nodeType !== 'Stage' && this.state.selectedNode === null && e.evt.shiftKey) { 
                window.console.log("Made start node");
                this.setState(prevState => ({
                    startNode: e.target.attrs.id,
                    selectedNode: null
                }));
                return;
            }
            else if (e.target.nodeType !== 'Stage' && this.state.selectedNode !== null && e.evt.shiftKey) { 
                window.console.log("Made end node");
                this.setState(prevState => ({
                    endNode: e.target.attrs.id,
                    selectedNode: null
                }));
            } 
            // Haven't selected a node yet
            else if (this.state.selectedNode === null && e.target.nodeType !== 'Stage') { 
                window.console.log("Clicked unselected node");
                this.setState(prevState => ({
                    selectedNode: e.target.attrs.id
                }));
                return;
            }
            // Add an edge because a node is already selected and we've clicked on one
            else if(this.state.selectedNode !== null && e.target.nodeType !== 'Stage' && this.state.selectedNode !== e.target.attrs.id) {
                window.console.log("Added edge");
                if (true) {
                    this.setState(prevState => ({
                        edges: [...prevState.edges, {node0: this.state.selectedNode, node1: e.target.attrs.id}],
                        selectedNode: null
                    }));
                    let edges = this.state.edges;
                    let edgeSize = [];
                    // TODO:: Get Intersection size based on max number of roads running between it and a given other node
                    for (let edge of edges) {
                        //edgeSize[edge.node0].push(edge.node1);
                        //edgeSize[edge.node1].push(edge.node0);
                    }
                    this.setState(state => {
                        const nodes = state.nodes.map((node, i) => {
                            return {
                                x: node.x, 
                                y: node.y
                                //size: this.findMax(edgeSize[i])
                            };
                        });
                        return {
                            nodes,
                        };
                    });
                }
                return;
            }
        }
        else {
            this.setState(prevState => ({
                selectedNode: null
            }));
            return;
        }
    }

    findMax = (numbers) => {
        let max = 0;
        let mode = null;
        let counted = numbers.reduce((acc, curr) => { 
            if (curr in acc) {
                acc[curr]++;
            } else {
                acc[curr] = 1;
            }

            if (max < acc[curr]) {
                max = acc[curr];
                mode = curr;
            }

            return acc;
        }, {});

        return max;
    }

    handleDragEndNode = (e) => {
        this.setState(state => {
            const nodes = state.nodes.map((node, i) => {
                if (e.target.attrs.id === i) {
                    return {x: e.evt.layerX, y: e.evt.layerY};
                } else {
                    return node;
                }
            });

            return {
                nodes,
            };
        });
    } 

    triggerGameLoop = () => {
        window.requestAnimationFrame(this.gameLoop);
    }

    gameLoop = (timestamp) => {
        // Game loop synchronizes to refresh rate, will need to adjust car speed at some point accordingly
        window.requestAnimationFrame(this.gameLoop);

        var self = this;
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

                    dX = ((car.dX * (0.96)) + (dX * 0.04)) * maxScalar;
                    dY = ((car.dY * (0.96)) + (dY * 0.04)) * maxScalar;
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

                    // // Set rotation by getting angle from direction vector
                    // if (self.stage.children[2].children[0] && self.stage.children[2].children[0].children[index] !== undefined) {
                    //     let radians = Math.atan2(dY, dX); //radians
                    //     // you need to divide by PI, and MULTIPLY by 180:
                    //     let degrees = 180 * radians / Math.PI;  //degrees
                    //     let angle = 90 + (360 + Math.round(degrees)) % 360; //round number, avoid decimal fragments
                    //     let rotation = 90 + (360 + Math.round(180 * Math.atan2(dY, dX) / Math.PI)) % 360;
                    //     self.stage.children[2].children[0].children[index].setRotation(rotation);
                    //     self.stage.children[2].children[0].children[index].setOffset({x: 6, y: 12});
                    // }
                }
            }
        }
    }

    componentDidMount() {
        this.triggerGameLoop();
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
                            {this.state.edges.map((edge, i) => (
                                <Group
                                    id={i}
                                    key={i} 
                                >
                                    <Line 
                                        strokeWidth = {24}
                                        stroke = 'white'
                                        shadowBlur = {5}
                                        points = {[this.state.nodes[edge.node0].x + 10, this.state.nodes[edge.node0].y + 10, this.state.nodes[edge.node1].x + 10, this.state.nodes[edge.node1].y + 10]}
                                    />
                                </Group>
                            ))}
                            {this.state.nodes.map((node, i) => (
                                <Group
                                    id={i}
                                    key={i}
                                    x={node.x} 
                                    y={node.y}
                                    onDragEnd={this.handleDragEndNode}
                                    draggable
                                >
                                    <Circle
                                        id={i}
                                        radius={12}
                                        offset={{x: -10, y: -10}}
                                        draggable
                                        fill={'white'}
                                    />
                                </Group>
                            ))}
                            {this.state.edges.map((edge, i) => (
                                <Group
                                    id={i}
                                    key={i} 
                                >
                                    <Line 
                                        strokeWidth = {20}
                                        stroke = 'grey'
                                        points ={[this.state.nodes[edge.node0].x + 10, this.state.nodes[edge.node0].y + 10, this.state.nodes[edge.node1].x + 10, this.state.nodes[edge.node1].y + 10]}
                                    />
                                    {/*this.state.edges.map((edge, i) => (
                                        <ColoredLine 
                                            id={i * 2 * this.state.edges.length}
                                            key={i * 2 * this.state.edges.length}
                                            points = {[this.state.nodes[edge.node0].x + 10, this.state.nodes[edge.node0].y + 10, this.state.nodes[edge.node1].x + 10, this.state.nodes[edge.node1].y + 10]}
                                        />
                                    ))*/}
                                </Group>
                            ))}
                            {this.state.nodes.map((node, i) => (
                                <Group
                                    id={i}
                                    key={i}
                                    x={node.x} 
                                    y={node.y}
                                    onDragEnd={this.handleDragEndNode}
                                    draggable
                                >
                                    <Circle
                                        id={i}
                                        radius={10}
                                        offset={{x: -10, y: -10}}
                                        fill={i === this.state.selectedNode ? 'white' : i === this.state.startNode ? 'blue' : i === this.state.endNode ? 'red' : 'grey'}
                                    />
                                </Group>
                            ))}
                        </Layer>
                        <Layer>
                            <Group>
                                {this.state.cars.filter(car => car !== null).map((car, i) => (
                                    <ColoredRect
                                        id={i}
                                        key={i}
                                        x={car.x} 
                                        y={car.y}
                                        rotation={90 + (360 + Math.round(180 * Math.atan2(car.dY, car.dX) / Math.PI)) % 360}
                                        offset={{x: 6, y: 12}}
                                    />
                                ))}
                            </Group>
                        </Layer>
                        <Layer>
                            <Label x={20} y={20}>
                                <Tag
                                    fill='green'
                                    pointerDirection= 'left'
                                    pointerWidth={10}
                                    pointerHeight={10}
                                    lineJoin= 'round'
                                    shadowColor= 'black'
                                    cornerRadius = {8}
                                />
                                <Text
                                    text='Shift + Click To Create Road Node'
                                    fontFamily='Roboto'
                                    fontSize={18}
                                    padding={8}
                                    fill='white'
                                />
                            </Label>
                            <Label x={20} y={55}>
                                <Tag
                                    fill='purple'
                                    pointerDirection= 'left'
                                    pointerWidth={10}
                                    pointerHeight={10}
                                    lineJoin= 'round'
                                    shadowColor= 'black'
                                    cornerRadius = {8}
                                />
                                <Text
                                    text='Select a node by clicking on it and then click another node to draw a road'
                                    fontFamily='Roboto'
                                    fontSize={18}
                                    padding={8}
                                    fill='white'
                                />
                            </Label>
                            <Label x={20} y={90}>
                                <Tag
                                    fill='Blue'
                                    pointerDirection= 'left'
                                    pointerWidth={10}
                                    pointerHeight={10}
                                    lineJoin= 'round'
                                    shadowColor= 'black'
                                    cornerRadius = {8}
                                />
                                <Text
                                    text='Shift + Click a node to Make it a Starting Node'
                                    fontFamily='Roboto'
                                    fontSize={18}
                                    padding={8}
                                    fill='white'
                                />
                            </Label>
                            <Label x={20} y={125}>
                                <Tag
                                    fill='Red'
                                    pointerDirection= 'left'
                                    pointerWidth={10}
                                    pointerHeight={10}
                                    lineJoin= 'round'
                                    shadowColor= 'black'
                                    cornerRadius = {8}
                                />
                                <Text
                                    text='Click then Shift + Click a Node to make it an ending node.'
                                    fontFamily='Roboto'
                                    fontSize={18}
                                    padding={8}
                                    fill='white'
                                />
                            </Label>
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }
}

export default RoadTrafficSim;
