import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
import axios from 'axios';
import {apiDomainPath} from './../../../../GlobalConfig';
import Loader from 'react-loader-spinner';
class UserUpdate extends Component {
  //======== constructor call =======
  constructor(props){
    super(props);
    this.state = {
      fields: {
        id:props.match.params.id,
        user_name:"",
        email:"",
        phone: ""
      },
      errors: {},
      formsubmitted:false,
      loaderAppear:true
    };
  }
  // error handle
  componentDidCatch(error, info) {
    var _this = this;
    _this.setState({ errors: error });
  }
  componentDidMount=()=> {
    var _this = this;
    axios.post(apiDomainPath.path+'/details.php',{id:_this.state.fields.id},{headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }})
    .then(function(res){
      _this.setState({
        fields: res.data.data,
        loaderAppear:false
      });
    })
    .catch(function(e) {
      console.log("ERROR ", e);
    })
  }
  //
  FormSubmitHandler=(event)=>{
    event.preventDefault();
    var _this = this;
    if(this.handleValidation()){
      //alert("Form submitted");
      _this.setState({loaderAppear:true});
      axios.post(apiDomainPath.path+'/update.php',this.state.fields,{headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }})
      .then(function(res){
        _this.setState({formsubmitted:true,loaderAppear:false});
      })
      .catch(function(e) {
        console.log("ERROR ", e);
      })
    }else{
      //alert("Form has errors.");
    }
  }
  //
  handleValidation=()=>{
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    //user-Name
    if(!fields["user_name"]){
      formIsValid = false;
      errors["user_name"] = "This field is required";
    }
    if(typeof fields["user_name"] !== "undefined"){
      if(!fields["user_name"].match(/^[a-zA-Z0-9]+$/)){
        formIsValid = false;
        errors["user_name"] = "Letters and numbers only.";
      }        
    }
    //Email
    if(!fields["email"]){
      formIsValid = false;
      errors["email"] = "This field is required";
    }
    if(typeof fields["email"] !== "undefined"){
      let lastAtPos = fields["email"].lastIndexOf('@');
      let lastDotPos = fields["email"].lastIndexOf('.');
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }
    //password
    // if(!fields["password"]){
    //   formIsValid = false;
    //   errors["password"] = "This field is required";
    // }
    //password
    if(!fields["phone"]){
      formIsValid = false;
      errors["phone"] = "This field is required";
    }    
    this.setState({errors: errors});
    return formIsValid;
  }
  //
  OnInputdataChange=(field, e)=>{
    let fields = this.state.fields;
    fields[field] = e.target.value;        
    this.setState({fields});
  }
  //
  render=()=>{
    if(this.state.formsubmitted){
      return (<Redirect to='/admin/user-list' state='Please sign in' />);
    }else{
      return (
        <div className="content-wrapper">
          <div className="row">
            {this.state.loaderAppear ? (
              <div className="col-lg-12 inner-content-loader">
                <Loader type="Bars" color="#1ec4d8" height={80} width={100} />
              </div>
            ) :(
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Manage Users <span className="pull-right"> <Link to="/admin/user-list" style={{textDecoration:'none'}}><i className="fa fa-long-arrow-left"></i> Back</Link></span></h4>
                    <p className="card-description">
                      <code>User Upadte</code>
                    </p>

                    <form className="forms-sample"  onSubmit={this.FormSubmitHandler.bind(this)}>
                      <input type="hidden" name="id" onChange={this.OnInputdataChange.bind(this, "id")} value={this.state.fields.id} />
                      <div className="form-group">
                        <label htmlFor="exampleInputUserName1">User Name</label>
                        <input type="text" className="form-control" id="exampleInputUserName1" placeholder="user Name" name="user_name" onChange={this.OnInputdataChange.bind(this, "user_name")} value={this.state.fields.user_name} />
                        <span style={{color: "red"}}>{this.state.errors["user_name"]}</span>
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail3">Email</label>
                        <input type="email" className="form-control" id="exampleInputEmail3" placeholder="Email" name="email" onChange={this.OnInputdataChange.bind(this, "email")} value={this.state.fields.email} />
                        <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                      </div>
                      {/* <div className="form-group">
                        <label>File upload</label>
                        <input type="file" name="img[]" className="file-upload-default">
                        <div className="input-group col-xs-12">
                          <input type="text" className="form-control file-upload-info" disabled="" placeholder="Upload Image">
                          <span className="input-group-append">
                            <button className="file-upload-browse btn btn-info" type="button">Upload</button>
                          </span>
                        </div> 
                      </div>*/}
                      <div className="form-group">
                        <label htmlFor="exampleInputPhoneNumber1">Phone Number</label>
                        <input type="text" className="form-control" id="exampleInputPhoneNumber1" placeholder="Phone Number" name="phone" onChange={this.OnInputdataChange.bind(this, "phone")} value={this.state.fields.phone} />
                        <span style={{color: "red"}}>{this.state.errors["phone_number"]}</span>
                      </div>
                      <button type="submit" className="btn btn-success mr-2">Save</button>
                      <Link to="/admin/user-list" className="btn btn-light">Cancel</Link>
                    </form>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}
export default UserUpdate;