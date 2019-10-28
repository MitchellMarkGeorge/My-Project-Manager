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

const electron = window.require('electron');
//const isDev = window.require('electron-is-dev');






//import * as electron from 'electron';
//const electron = window.require('electron');

class App extends Component {

    render() {
    return (

      <SplitPane split="vertical" minSize={230} defaultSize={230} maxSize={400}>
        
        <ProjectList/>
        <ProjectPage/>
        
      </SplitPane>
    );

  }

}

class ProjectListItem extends Component {

  constructor(props) {
    super(props)
    //this.getItem = this.getItem.bind(this);
    // does it need to have its own independent state???
  }

  getItem(data) {
    console.log(data);
    //console.log(e);
  }
  
  render() {
    return (
      this.props.list.map((item) => <div key={item._id} onClick={this.getItem.bind(this, item)} className="test">{item.name}</div>
      )
    )
  }

}

class ProjectList extends Component {
  constructor(props){
    super(props)

    this.state = {
      projects: new DB({filename: (electron.app || electron.remote.app).getPath('userData'), autoload: true}),
      list: []
      // this.setState({list: [...this.state.list, new_item]})
      // this.state.projects.insert(new_item)
      
    }
// get all projects

    //this.insertDoc();
    this.state.projects.find({}, (err, data) => {
      if (!err) {
        console.log(data);
        //this.state.list = data;
        this.setState({list: data})
      } else if (err) {
        console.error(err);
      }
    })

    //this.setState({list: list})

    //this.insertDoc();
    // DELETE USING ID'S
     //let db = this.state.db.find({})
    
    console.log(electron.remote.app.getPath('userData'));
  }

  insertDoc = () => {
    let doc = {name: "Jane", type:'Frontend'}
    this.state.projects.insert(doc);
    
  }

  render() {
    //let list = this.state.list;
    return (
    <div className="project-list">
      {this.state.list.length === 0 && <div>No project</div>}

      <ProjectListItem list={this.state.list}/>
    
    
    </div>
    );
  }


}

class ProjectPage extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
    <div className="container">
      <h1 className="project-title">ProjectPage</h1>
    </div>
    );
  }


}

// TODO - github

export default App;
