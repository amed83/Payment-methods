
import React from 'react'
import classes from './Backdrop.css'

const backdrop = (props) =>(

    props.visible ? <div className={classes.backdrop}
    onClick={props.clicked}></div> : null

)



export default backdrop
