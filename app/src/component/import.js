import React, {useCallback, useEffect} from 'react'
import Modal from "react-modal"
import { Button } from "@mui/material";
import Papa from "papaparse"

export default function ImportView({
    showImportView,
    setShowImportView,
    mailGroups,
    setMailgroups
}){
    Modal.setAppElement(document.getElementById('root'))

    // rootを０として入れ子構造の深さを計算（最大深度）
    function setMailgroupDepth(targetMailGroupName,depth,mailGroups,ancenstorMailgroupName){
        const mailGroup = mailGroups.get(targetMailGroupName)
        const children = mailGroup.children
        mailGroup.depth = mailGroup.depth < depth ? depth : mailGroup.depth
        mailGroup.ancenstorMailgroups.push(ancenstorMailgroupName)
        children.forEach(child => {
            setMailgroupDepth(child,mailGroup.depth+1,mailGroups,ancenstorMailgroupName)
        })
    }

    function parseMailGroupsDepth(mailGroups){
        const rootMailGroups = Array.from(mailGroups)
            .filter((elem)=>{ return(elem[1].parents.length === 0) })
            .map(elem => { return(elem[0]) })
        rootMailGroups.forEach(value => {
            setMailgroupDepth(value,0,mailGroups,value)
        }) 
    }

    // メールグループの親子関係をパース
    const parseMailGroups = (rawData) => {
        console.log(rawData)
        const tmpMailGroups = new Map()
        rawData.forEach((elem,index)=> {
            if(index===0){return}
            // console.log(elem) 
            const targetMailgroup = elem[0]
            const childMail = elem[1]
            
            if (!tmpMailGroups.has(targetMailgroup)){
                const parents = []
                const children = []
                tmpMailGroups.set(targetMailgroup,{"parents":parents,"children":children,"depth":0,"ancenstorMailgroups":[]})
            }
            const children = tmpMailGroups.get(targetMailgroup).children
            children.push(childMail)
            
            if(!tmpMailGroups.has(childMail)){
                const parents = [] 
                const children = []
                tmpMailGroups.set(childMail,{"parents":parents,"children":children,"depth":0,"ancenstorMailgroups":[]})
            }
            const parents = tmpMailGroups.get(childMail).parents
            parents.push(targetMailgroup)
        });
        return tmpMailGroups
    }

    const onChangeFile = (event) => {
        const file = event.target.files[0]
        console.log(file)
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => {
            const result = Papa.parse(reader.result)
            const mailGroups = parseMailGroups(result.data)
            parseMailGroupsDepth(mailGroups)
            console.log(mailGroups)
            setMailgroups(mailGroups)
        }
    }
    
    return(
    <Modal isOpen={showImportView}>
        <input
            name='file'
            type='file'
            onChange={onChangeFile}
        />
        <Button
            onClick = { () => {setShowImportView(false)} }
        >
            閉じる
        </Button>
    </Modal>
    )
}