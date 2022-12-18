import styles from './main.css'
import DetailInfoCard from './detailCard.js';

import React, {useEffect, useState} from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import createEngine, {
    DiagramModel,
    DefaultNodeModel,
    DefaultLinkModel,
} from "@projectstorm/react-diagrams"
import { requirePropFactory } from '@mui/material';

const engin = createEngine()
let model = new DiagramModel()
let nodes = new Map()
engin.setModel(model)

export default function Main({
    showImportView,
    setShowImportView,
    mailGroups,
    setMailgroups,
    selectedMailGroups,
    setSelectedMailGroups
}) {
    let rootMailGroups = []
    let userMails = []

    function addNode(targetMailGroupName,isRoot=false) {
        const targetMailGroup = mailGroups.get(targetMailGroupName)
        const isUser = userMails.includes(targetMailGroupName) 
        if(nodes.get(targetMailGroupName) !== undefined){ return }
        if(isUser){ return }

        const node = new DefaultNodeModel({
            name: isUser ? "ユーザーアドレス" : targetMailGroupName,
            color: !isUser ? "rgba(192, 0, 25, 0.2)" :  "rgba(0, 192, 255, 0.2)"
        })
        node.id = targetMailGroupName
        // node.setPosition(x,y)
        node.registerListener({
            selectionChanged: (event) => {
                // console.log("selected:",node.id)
                // console.log(event)
                let tmpSelectedMailGroups = new Set(selectedMailGroups)
                if(event.isSelected){
                    tmpSelectedMailGroups.add(node.id)
                    console.log(tmpSelectedMailGroups)
                }else{
                    tmpSelectedMailGroups.delete(node.id)
                    console.log(tmpSelectedMailGroups)
                }
                setSelectedMailGroups(tmpSelectedMailGroups)
            }
        })
        node.addInPort(" ")
        model.addAll(node)
        const childrenPositions = new Array()
        const parentsPositions = new Array()
        targetMailGroup.children.forEach(child => {
            node.addOutPort(child)
            const childNode = nodes.get(child)
            if(childNode === undefined){ return }
            const position = {x:childNode.getX(),y:childNode.getY(),name:child}
            childrenPositions.push(position)
            const link = new DefaultLinkModel()
            link.setSourcePort(node.getPort(child))
            link.setTargetPort(childNode.getPort(" "))
            model.addAll(link)
        })
        targetMailGroup.parents.forEach(parent => {
            const parentNode = nodes.get(parent)
            if(parentNode === undefined){ return }
            const position = {x:parentNode.getX(),y:parentNode.getY(),name:parent}
            parentsPositions.push(position)
            const link = new DefaultLinkModel()
            link.setSourcePort(parentNode.getPort(targetMailGroupName))
            link.setTargetPort(node.getPort(" "))
            model.addAll(link)
        })
        // console.log(parentsPositions,childrenPositions)
        const point = decideNodePosition(targetMailGroupName,parentsPositions,childrenPositions)
        node.setPosition(point.x,point.y)
        nodes.set(targetMailGroupName,node)
    }

    function decideNodePosition(targetMailGroupName,parentsPositions,childrenPositions) {
        let x = 0,y = 0
        //rootNodeの場合
        // console.log(parentsPositions)
        if(parentsPositions.length === 0 ){
            x = 0;
            const index = rootMailGroups.indexOf(targetMailGroupName)
            y = index * 150
        }
        //それ以外
        else {
            // x軸
            const mailGroup = mailGroups.get(targetMailGroupName)
            parentsPositions.sort((elem1,elem2)=>elem2.x-elem1.x)
            x = mailGroup.depth * 200 
            // y軸
            parentsPositions.sort((elem1,elem2)=>elem2[1]-elem1[1])
            y = parentsPositions[0].y
            const brother = mailGroups.get(parentsPositions[0].name).children
            const brotherIndex = brother
                                    .filter(elem => {return !userMails.includes(elem)})
                                    .indexOf(targetMailGroupName)
            y = y + brotherIndex * 120
        }
        return {x:x,y:y}
    }

    function createNodeTree(targetMailGroupName,dissmiss=[]) { 
        const mailGroup = mailGroups.get(targetMailGroupName)
        // console.log('target:',targetMailGroupName)
        // console.log(mailGroup)
        addNode(targetMailGroupName,true)
        mailGroup.children.forEach(child => {
            if(dissmiss.includes(child)){return}
            createNodeTree(child)
        })
    }

    
    useEffect(() => {
        console.log("useEffect")
        model = new DiagramModel()
        nodes = new Map()
        if (mailGroups === undefined) { return }
        rootMailGroups = Array.from(mailGroups)
            .filter((elem)=>{ return(elem[1].parents.length === 0) })
            .map(elem => { return(elem[0]) })
        userMails = Array.from(mailGroups)
            .filter((elem)=>{ return(elem[1].children.length === 0) })
            .map(elem => { return(elem[0]) })
        // console.log(userMails)

        rootMailGroups.forEach((rootMailGroup)=>{
            if(!userMails.includes(rootMailGroup)){
                createNodeTree(rootMailGroup)
            }
        })

        engin.setModel(model)
    },[mailGroups])
    
    return (
    <div className="Main">
        <CanvasWidget className='diagram' engine={engin}/>
        <div style={{ minWidth:300,position:"absolute", bottom:"80px",right:"20px" }}>
            <DetailInfoCard
                mailGroups={mailGroups}
                selectedMailGroups={selectedMailGroups}
                setSelectedMailGroups={setSelectedMailGroups}
            />
        </div>
        <div style={{ background:"gainsboro",minWidth:300, minHeight:60, position:"absolute", bottom:"10px", right:"20px" }}>
            <TextField
                id="filled-basic" label="検索" variant="filled" 
                select
                sx={{width:"100%"}}
            />
        </div>
        

    </div>
    )

}