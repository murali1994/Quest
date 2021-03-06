import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IndividualQuestion from '../ReactLandingpage/individualquestion.js';
import Dialog from 'material-ui/Dialog';
import $ from 'jquery';
import Cookies from 'universal-cookie';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

const cookies = new Cookies();
var token = cookies.get('token');
const styles={
  submitbtn:{
    width:'50%',
    marginLeft:'25%',
    marginTop:'5%'
  }
}

class Editor extends React.Component {

  constructor(props) {
      super(props);
      this.state={
        title:'',
        description:'',
        openAnswer: false,
        answers:'',
        token:null,
        btnStatus:false
      }
    }

    componentWillMount(){
      this.setState({token:token});
      if(token != null){
        this.setState({btnStatus:true});
      }
    }

    
    titleChange(e){
      this.setState({title:e.target.value});
    }
    descriptionChange(e){
      this.setState({description:e.target.value});
    }

    checkForQuestionSuccessAlert(){
      this.props.toaster.success(
        'Fillout the description',
      '', {
        timeOut: 3000,
        extendedTimeOut: 3000
          }
    );
    }

    checkForPostQuestionSuccessAlert(){
      this.props.toaster.success(
        'Posted successfully',
      '', {
        timeOut: 3000,
        extendedTimeOut: 3000
          }
    );
    }

    postQuestion(){
      var that = this;
      if(that.state.description == '' ){
        that.checkForQuestionSuccessAlert();
      }
      else{
      $.ajax({
               url: '/question',
               type: 'POST',
               data: {
                   title: that.state.title,
                   searchValue: that.state.description,
                   user:cookies.get('emailId'),
                   time:new Date()
               },
               success: function(response) {
                   if(response == "Question posted"){
                     that.checkForPostQuestionSuccessAlert();
                     that.props.handleClose();
                   }
                   else{
                     that.setState({openAnswer: true});
                     var answers = response.map((row,index)=> {
                      return <IndividualQuestion answer={row.answer} answered_by={row.answered_by} likes={row.likes} dislikes={row.dislikes} timestamp={row.time} key = {index}/>
                    });
                    that.setState({answers:answers});
                  }

               },
               error: function(err) {
                   alert(err);
               }
           })
         }
    }
    render() {
        return (
          <div className="text">
          <div className="form-group">
            <label for="usr">Title</label>
            <input type="text" className="form-control" placeholder="Enter your title...(Eg:React,jsx,dom)" id="usr" onChange={this.titleChange.bind(this)}/>
          </div>
          <div className="form-group">
            <label for="exampleTextarea">Question</label>
            <textarea className="form-control" id="exampleTextarea" rows="6" placeholder="Write your question here...." onChange={this.descriptionChange.bind(this)}></textarea>
          </div>
        <RaisedButton  primary={true} style={styles.submitbtn} onClick={this.postQuestion.bind(this)}>Post your question
          </RaisedButton>
          </div>
        );
    }
}

export default Editor;
