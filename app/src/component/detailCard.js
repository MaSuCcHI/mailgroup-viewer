import React, {useEffect, useState} from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from "@mui/material";

export default function DetailInfoCard({
    mailGroups,
    selectedMailGroups,
    setSelectedMailGroups
}) {
    let cards = []
    useEffect(()=>{
    },[selectedMailGroups])

    function allChildrenUsers(mailGroupName) { 
        let children = new Set()
        const mailGroup = mailGroups.get(mailGroupName)
        if(mailGroup.children.length===0){
            children.add(mailGroupName)
            return children
        }else{
            mailGroup.children.forEach(child => {
                children = new Set([...children, ...allChildrenUsers(child)])
            })
        }
        return children
    }

    return(
        <div>
          {Array.from(selectedMailGroups).map( mailGroupName =>{
            const mailGroup = mailGroups.get(mailGroupName)
            const children = Array.from(allChildrenUsers(mailGroupName))
            return(
                <Card>
                    <CardContent>
                        <Typography variant="h4" component="div">
                            {mailGroupName}
                        </Typography>
                        <Typography variant="h8" component="div">
                            ユーザーアドレス
                        </Typography>
                        {children.map((child,index)=>{
                            const delimiter = index%2===0 ? ", " : <br />
                            return(
                                <Typography variant="h20">
                                    {child}{delimiter}
                                </Typography>
                            )
                        })}
                    </CardContent>
                    <CardActions>
                        <Button size="small">More Info</Button>
                    </CardActions>
                </Card>
            )})
          }
        </div>
    )
}