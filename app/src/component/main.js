import styles from './main.css'

import React, {useEffect, useState} from "react";
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import createEngine, {
    DiagramModel,
    DefaultNodeModel,
    DefaultLinkModel,
} from "@projectstorm/react-diagrams"

const engin = createEngine()
let model = new DiagramModel()
let nodes = new Map()
engin.setModel(model)

export default function Main({
    showImportView,
    setShowImportView,
    mailGroups,
    selectedMailGroups,
    setSelectedMailGroups
}) {
    
    useEffect(() => {
        model = new DiagramModel()
        nodes = new Map()
        if (mailGroups === undefined || selectedMailGroups === undefined ) { return }


    },[mailGroups,selectedMailGroups])
    
    return (
    <div className="Main">
        <CanvasWidget className='diagram' engine={engin}/>
    </div>
    )

}