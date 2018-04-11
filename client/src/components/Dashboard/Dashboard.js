import React, { Component } from 'react';
import classes from './Dashboard.css';
import axios from 'axios';
import { Link } from 'react-router-3';


class Dashboard extends Component {
    state={
        users:[],
        searchValue:"",
        searchOption:false,
        page:0,
        showDetails:false,
        detailsId:'',
        detailsButton:'ShowDetails',
        error:'',
        showPage:0
    }

    getData(){
        axios.get('/users/:0')
        .then(data=>{
            console.log('data',data)
            this.setState({
                users:data.data.Users
            })
        }).catch(e=> this.setState({error: 'Error, please reload the page'}))
    }

    componentDidMount(){
        this.getData()
    }

    handleSearch(){
        if(!this.state.searchValue){
            this.setState({searchOption:false})
            this.getData()
        }else{
            this.setState({searchOption:true})
        }
    }

    handleChange(event){
            if(!event.target.value){
                this.setState({searchOption:false})
                this.setState({searchValue:event.target.value})
                this.getData()
            }else{
                this.setState({searchValue:event.target.value})
            }
    }

    renderDetails(id){
        if(this.state.showDetails && id===this.state.detailsId){
            this.setState({
                    showDetails:false
                })
        }else{
            this.setState({
                showDetails:true,
                detailsId:id,
            })
        }
    }

    changePage(goTo){
        let {page} = this.state
        this.setState({page:goTo==='next' ? this.state.page+1 : this.state.page-1},(err)=>{
            axios.get(`/page/:${this.state.page}`)
            .then(data=>{
                if(data){
                    console.log('data',data)
                    this.setState({
                        users:data.data.Users
                    },()=>this.setState({showPage:this.state.page}))
                }else{
                    console.log('no data erroooooorrrrrrr')
                }
            }).catch(err=> this.setState({error: 'Error, please reload the page'}))
        })
    }

  render() {

        let users= ""
        let singleUser= ""
        let selectid= ""
        let newDetails = ""
        if(!this.state.searchOption){
             users = this.state.users.map(user=>{
            const paymentMethod = user.PaymentMethods.filter(method=> method.default===true)
            .map(method=> <div key={user.id}>
                    {method.type}, currency: {method.currency}</div>
                )
            if(this.state.showDetails && this.state.users.length>0){

                    let selectUser = this.state.users.filter(user=> user.id ===this.state.detailsId)
                    if(selectUser.length>0){
                        selectid= selectUser[0].id
                        newDetails = selectUser.map(user=>{
                               const otherMethods = user.PaymentMethods.map((method,i)=>{
                                   return(
                                       <div key={i}>
                                           <p><b>{i+1+`)`} Method</b>: {i+1} {method.name}</p>
                                           <ul>
                                               <li><b>ID</b>: {method.id}</li>
                                               <li><b>Ending-with</b>: {method.ending_with}</li>
                                               <li><b>Currency</b>: {method.currency}</li>
                                               <li><b>Default</b>: {method.default ? 'Yes' : 'No'}</li>
                                           </ul>
                                       </div>
                                   )
                               })
                            return(
                                    <div className= {classes.detailsList} key={user.id}>
                                       <p><b>Fist Name</b>: {user.name}</p>
                                       <p><b>Last Name</b>: {user.surname}</p>
                                       <p><b>Signup date</b>: {user.signup_date.substring(0,10)}</p>
                                       <p><b>All Payment Methods: </b>: {otherMethods}</p>
                                   </div>
                               )
                        })
                    }
            }
             return  (
                 <div key={user.id} className={classes.usersList}>
                    <p><b>Username</b> : {user.username} </p>
                    <p><b>Id</b> : {user.id}</p>
                    <p><b> email </b>: {user.email}</p>
                    <p><b>Payment_Method </b> :{paymentMethod}</p>
                    <button onClick={(id)=>this.renderDetails(user.id)}>{selectid===user.id ? 'HideDetails': 'ShowDetails'}</button>
                    <div className={classes.details}>
                        <p>{selectid===user.id  ? newDetails :null}</p>
                    </div>
                </div>
                 )
             })

        }else{
            //build single user view
            if(this.state.users){
                console.log('newDetails',newDetails)
                const {searchValue} = this.state
                let selectuser = this.state.users.filter(user=>user.email === searchValue)
                if(selectuser.length !== 0){
                    const paymentMethod2 = selectuser[0].PaymentMethods.filter(method=>method.default===true)
                            .map(method => <span key={selectuser.id}>
                            {method.type}, currency: {method.currency}</span>)

                    singleUser = (<div key={singleUser.id}>
                                    <p><b>Username</b> : {selectuser[0].username} </p>
                                    <p><b>Id</b> : {selectuser[0].id}</p>
                                    <p><b> email </b>: {selectuser[0].email} </p>
                                    <p><b>Payment_Method </b> :{paymentMethod2}</p>

                        </div>)
                }else{
                    console.log('stocazzo')
                }
            }
        }

    return (
      <div >

            <input value={this.state.value} onChange={(event)=>this.handleChange(event)}/>
            <button onClick={()=> this.handleSearch()}>Search</button>
            <div onClick={(goTo)=>this.changePage(goTo='next')}><a href="#">NextPage</a></div>
            <div onClick={(goTo)=>this.changePage(goTo='prev')}><a href="#">PrevPage</a></div>
             <div className={classes.usersContainer}>
                {this.state.showPage}
                {users}
                {singleUser}
                {this.state.error}
            </div>
      </div>
        )
    }

}
export default Dashboard

// <Link to={'/user/'+ user.id}>
// </Link>