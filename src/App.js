import React, { Component } from 'react';
//const store = window.require('electron');
//import ReactDOM from 'react-dom';

import './App.css';
import './ProjectPage.css';
import './ProjectList.css';
import './ProjectItem.css';
// const Store  = window.require('electron-store');
import SplitPane from 'react-split-pane';
import * as DB from 'nedb';
import ReactModal from 'react-modal';
import {Project} from './Project.js';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import * as arrayMove from 'array-move';




const electron = window.require('electron');
//const isDev = window.require('electron-is-dev');


// Notes
//- Need to work on build scripts (look at React Electron Tutorials)
// - All features will use shortcuts
  // after any updates, the project list should be updated

ReactModal.setAppElement('#root')
let db = new DB({filename: (electron.app || electron.remote.app).getPath('userData'), autoload: true});
//import * as electron from 'electron';
//const electron = window.require('electron');


const SortableItem = SortableElement(({value, onRemove, idx}) => 
<div className="sort-div">
  <p className="list"><b>{`(${idx + 1})`}</b> {value} <button className="del-button" onClick={() => onRemove(idx)}> Delete</button></p> 
  
</div>); {/* Can also be a listitem <li></li> */}

const SortableList = SortableContainer(({items, onRemove}) => {   // find way to make item list itself scrollable (overflow: auto;)
  return (    
    <div className="list-container"> {/* Can also be a list <ul></ul> */}
      {items.map((value, index) => (
        <SortableItem key={index} index={index} idx={index} value={`${value} - ${index + 1}`} onRemove={onRemove}/>
       
        
      ))}
    </div>
  );
});

class App extends Component {

  constructor(props){
    super(props)

    this.getDocID = this.getDocID.bind(this);
    this.disableModal = this.disableModal.bind(this);
    this.displayModal = this.displayModal.bind(this);
    // this.loadProjects = this.loadProjects.bind(this);
    //this.onSortEnd = this.onSortEnd.bind(this);

    this.state = {
      list: [],
      data: undefined,
      showModal: false,
      data_list: []
      
            
    }

    
// get all projects

    // this.insertDoc('Test', 'Developer');
    // this.insertDoc('John', 'Worker');
    // this.insertDoc('Mary', 'Teacher');
    // this.insertDoc('Dummy', 'Developer');
    // this.insertDoc('Sharon', 'Principal');
    // this.insertDoc('Adam', 'Police');

    // let test_project = new Project()
    // test_project.name = 'ListTest2';
    // test_project.type = 67;
    // test_project.items.push("Hello", "WHY", "4", "0", "oops", "12232", "hahaha", "7979", "heheehe", "upepe", "ahhh", "mummy");

    //  db.insert(test_project);

    db.find({}, (err, data) => {
      if (!err) {
        console.log(data);
        //this.state.list = data;
        this.setState({list: data})
      } else if (err) {
        console.error(err);
      }
    })

    //  db.remove({}, { multi: true }, function (err, numRemoved) {
    //  });

    

    
    // DELETE USING ID'S
     //let db = this.state.db.find({})
    
    console.log(electron.remote.app.getPath('userData'));
  }

  componentDidMount() {
    // might load projects in here
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({data_list}) => ({
      data_list: arrayMove(data_list, oldIndex, newIndex),
    }));

    db.update({_id: this.state.data._id}, {$set: {items: this.state.data_list}}, (err, num) => {
      if (!err) {
        this.loadProjects();
       } //else {
      //   this.props.loadProjects();
      // }
    })
 
  }

  removeItem = (index) => {
    console.log(index)
    let list = this.state.data_list;
    list.splice(index, 1);

    this.setState({data_list: list})
  }

  insertDoc = (name, type) => {
    let doc = {name: name, type: type}
    db.insert(doc);
    
  }

  addItemtoData = (element) => {

    console.log(element);

    //if (element.target.value === '') return;
    
    //  this.setState({data_list: this.state.data_list.push(ele)});
    this.setState({data_list: [element, ...this.state.data_list]}, () => {
      db.update({_id: this.state.data._id}, {$set: {items: this.state.data_list}}, (err, num) => {
        if (!err) {
          this.loadProjects();
         } //else {
        //   this.props.loadProjects();
        // }
      })
    });
    // this.setState((prevstate) => ({
    //   data_list: [element, ...prevstate.data_list]
    // }));
    
    
 
  }

  getDocID(data) {
    this.setState({data: data, data_list: [...data.items]})
    console.log(data);
  }

  displayModal() {
    this.setState({showModal: true});
    //console.log(this.state.showModal);
  }

  disableModal() {
    this.setState({showModal: false});
    //console.log(this.state.showModal);
  }

  loadProjects = () =>  {
    db.find({}, (err, data) => {
        if (!err) {
          console.log(data);
          //this.state.list = data;
          this.setState({list: data})
        } else if (err) {
          console.error(err);
        }
      })
  }


    render() {
      return (
      <div>
      <SplitPane split="vertical" minSize={230} defaultSize={230} maxSize={400}>
        
        <ProjectList list={this.state.list} func={this.getDocID} displayModal={this.displayModal.bind(this)} disableModal={this.disableModal.bind(this)}/>
        {/* shoudl i bind "this" here or in constructor */}
        <ProjectPage data={this.state.data} data_items={this.state.data_list} onEnd={this.onSortEnd} addItem={this.addItemtoData} loadProjects={this.loadProjects} removeItem={this.removeItem}/>
        
        {/* <ProjectPage projectslist={this.state.list} data={this.state.data}/> */}
        
        
        
      </SplitPane>

      <ReactModal isOpen={this.state.showModal} contentLabel="Example Modal">
        <div>Hello</div>
        <button onClick={this.disableModal}>Close Me</button>
      </ReactModal>

    </div>
    );

  }

}

// class ProjectListItem extends Component {

//   constructor(props) {
//     super(props)
//     //this.getItem = this.getItem.bind(this);
//     // does it need to have its own independent state???
//   }

  
  
//   render() {
//     return (
      
//       )
//     )
//   }

// }

class ProjectList extends Component {
 
  getItem(data) {
    console.log(data._id);
    //console.log(e);
  }

  render() {
    //let list = this.state.list;
    return (
    <div className="project-list">

      {this.props.list.length === 0 && 
      <div className="no-project">
        <p>No Projects Here.</p>
        <p>Would you like to make a Project?</p>
        <button className="button" onClick={this.props.displayModal.bind(this)}>Make Project</button>
      </div>} 
      
      {this.props.list.map((item) => 
      <div key={item._id} onClick={this.props.func.bind(this, item)} className="test">
        <p className="project-name">{item.name}</p>
      </div>)}

      {/* <button onClick={this.props.displayModal.bind(this)}>Hey Modal</button>
      <button onClick={this.props.disableModal.bind(this)}>Close Modal</button> */}

      
    
    </div>
    );
    
    
  }


}

class ProjectPage extends Component {

  // after any updates, the project list should be updated
  constructor(props) {
    super(props);

    this.state = {
      current_object: undefined,
      input_value: ''
      
      
    }
  } // might have its own state - to manage document based operations like remove, update, add
  // TO GET DOCUMENT, USE 

  saveProject() {
    // find old object based on id
    // Update object
    // use props and 'loadProjects' againg so the write document is always returned
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.current_object) {
      return {
        current_object: props.data,
        
        
        
      };
    }
    return null;
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(e.target.value);
     
      this.props.addItem(e.target.value);
      //this.setState({input_value: ''})

      // this.setState(() => ({
      //   input_value: ''
      // }));
      
    } else return;
  }

  update = () => {
    db.update({_id: this.props.data._id}, {$set: {items: this.props.data_items}}, (err, num) => {
      if (!err) {
        this.props.loadProjects();
       } //else {
      //   this.props.loadProjects();
      // }
    })
  }

  delete = (index) => {
    this.props.removeItem(index)
    this.update()
  }

  // removeItem = (index) => {
  //   console.log(index)
  //   let list = this.props.data_items;
    
  // }

  
  
  render() {
    //console.log(this.state.list)
    let data = this.props.data
    
    
    return (
    <div className="container">
      {/* <h1 className="project-title">Project</h1> */}
      {/* <h1>{this.props.data}</h1> */}

      <h1 className="project-title" >{data ? `${data.name}` : 'No Project Selected'}</h1>
      {!data && <h3>Selected Projects will show here.</h3>}
      {/* {data && <button className="button" onClick={this.update}>Save Changed Project Details</button>} */}
      {/* <h3>{data ? `${data._id}`: ''}</h3>
      <h3>{data ? `Type: ${data.type}`: ''}</h3> */}
      {data && <input className="input" onKeyDown={this.handleKeyDown} placeholder="Enter new Project Item Here" defaultValue={this.state.input_value}></input>}
      {/* <h4>{this.state.current_object ? `${this.state.current_object._id}`: 'None'}</h4> */}
      {/* <ul>
        {this.props.data_items.map(items => <li>{items}</li>)}
      </ul> */}

      

{/* onChange={this.props.addItem} */}
      
      {/* {data && <SortableList items={this.props.data_items} onSortEnd={this.props.onEnd} onRemove={(index) => this.props.removeItem(index)}/>} */}
      {data && this.props.data_items.length > 0 && <SortableList items={this.props.data_items} onSortEnd={this.props.onEnd} onRemove={(index) => this.delete(index)}/>}      
      {!this.props.data_items.length > 0 &&  <p>No Project Items</p>}
    </div>
    );
  }


}

// TODO - github

export default App;
