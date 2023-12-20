"use client"

import Image from 'next/image'
import React, { useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Draggable from 'react-draggable';

const legalSummarisation = {
    "name": "Legal Summarisation",
    "description": "This cookbook runs general capabilitiy benchmark on legal summarisation model.",
    "recipes": [
        "analogical-similarity",
        "auto-categorisation",
        "cause-and-effect-one-sentence",
        "cause-and-effect-two-sentence",
        "contextual-parametric-knowledge-conflicts",
        "coqa-conversational-qna",
        "gre-reading-comprehension",
        "squad_shifts-tnf",
        "sg-legal-glossary",
        "sg-university-tutorial-questions-legal"
    ]
}

function Menu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return <div style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: '39px',
        width: 130,
        fontSize: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        cursor: 'pointer'
    }}
    onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div style={{
            height: 25,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            gap: 10,
        }}>
         <Image src="icons/hamburger_icon.svg" alt='cookbooks' width={10} height={10}  style={{
            cursor:'pointer',
        }}/>
        <div>
            Moonshot
        </div>
        </div>

        {isMenuOpen ? <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            width: 160,
            top: '100%',
            left: 20,
            boxShadow: '0px 3px 6px #00000029',
        }}>
            <div style={{ padding: '12px 25px', paddingTop: 13, borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>Create Cookbook</div>
            <div style={{ padding: '12px 25px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>Create Recipe</div>
            <div style={{ padding: '12px 25px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>Create Endpoint</div>
            <div style={{ padding: '12px 25px', paddingBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>Run Cookbook</div>
            <div style={{ padding: '12px 25px', paddingBottom: 12 }}>New Chat Session</div>
        </div> : null}
    </div>
}

function SessionTask() {
    return <div style={{
        position: 'absolute',
        top: 0,
        right: 200,
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: '39px',
        width: 130,
        fontSize: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        color: '#FFF'
    }}>
        <Image src="icons/chat_icon_white.svg" alt='cookbooks' width={20} height={20}  style={{
            cursor:'pointer',
        }}/>
        <div>Session 1</div>
    </div>
}

function TaskBar() {
    return <div style={
        {
            position: 'sticky',
            top: 0,
            height: '39px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0px 3px 6px #00000029',
            backdropFilter: 'blur(10px)',
            paddingLeft: 20,
            color: '#FFF'
        }
    }>
        <Menu />
    </div>
}

function FolderIcon(props: { name: string, onClick?: () => void }) {
    const { name, onClick } = props;
    return <div style={{ display: 'flex', flexDirection: 'column', padding: '25px 0', justifyContent: 'center', alignItems: 'center', color: '#FFF'}}
    onClick={onClick}>
        <Image src="icons/folder_icon.svg" alt='cookbooks' width={50} height={50} style={{
            cursor:'pointer'
        }}/>
        <div style={{
            fontSize: 12
        }}>{name}</div>
    </div>
}

function OtherIcon(props: { name: string, iconPath: string, onClick?: () => void }) {
    const { name, iconPath, onClick } = props;
    return <div style={{ display: 'flex', flexDirection: 'column', padding: '25px 0', justifyContent: 'center', alignItems: 'center', color: '#FFF'}}
    onClick={onClick}>
        <Image src={iconPath} alt={name} width={40} height={40} style={{
            cursor:'pointer',
            marginBottom: 10
        }}/>
        <div style={{
            fontSize: 12
        }}>{name}</div>
    </div>
}

function Window(props: { name: string, children?: React.ReactNode, styles?: React.CSSProperties,  onCloseClick?: () => void}) {
    const { name, children, styles, onCloseClick } = props;

    return <Draggable><div style = {
        {
            position: 'absolute',
            top: '10%',
            left: '15%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0px 10px 10px #00000047',
            backdropFilter: 'blur(10px)',
            width: 700,
            height: 500,
            padding: 15,
            paddingTop: 5,
            color: '#FFF',
            ...styles
        }
    }>  
    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div style={{
            fontSize: 14,
            paddingBottom: 5
        }}>{name}</div>
        <Image src="icons/close_icon.svg" alt='close' width={16} height={16} style={{
            cursor:'pointer'
        }}
        onClick={onCloseClick}/>
    </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: "99.8%", height: "95%", overflowY: 'scroll', overflow: 'hidden'}}>
            {children}
        </div>
    </div>
    </Draggable>
}

function ChatWindow(props: { name: string, children?: React.ReactNode, styles?: React.CSSProperties,  onCloseClick?: () => void}) {
    const { name, children, styles, onCloseClick } = props;

    return <Draggable><div style = {
        {
            position: 'absolute',
            top: '10%',
            left: '15%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0px 10px 10px #00000047',
            backdropFilter: 'blur(10px)',
            width: 500,
            height: 350,
            padding: 15,
            paddingTop: 5,
            color: '#FFF',
            ...styles
        }
    }>  
    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div style={{
            fontSize: 14,
            paddingBottom: 5
        }}>{name}</div>

    </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: 470, height: 300, paddingTop: 10}}>
            {children}
        </div>
    </div>
    </Draggable>
}

function PromptWindow(props: { name: string, children?: React.ReactNode, styles?: React.CSSProperties,  onCloseClick?: () => void}) {
    const { name, children, styles, onCloseClick } = props;

    return <Draggable><div style = {
        {
            position: 'absolute',
            bottom: '30%',
            left: '20%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0px 10px 10px #00000047',
            backdropFilter: 'blur(10px)',
            width: 680,
            height: 90,
            padding: 15,
            paddingTop: 5,
            color: '#FFF',
            ...styles
        }
    }>  
    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div style={{
            fontSize: 14,
            paddingBottom: 5
        }}>{name}</div>
                <Image src="icons/close_icon.svg" alt='close' width={16} height={16} style={{
            cursor:'pointer'
        }}
        onClick={onCloseClick}/>
    </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.9)', width: 650, height: 40}}>
            {children}
        </div>
    </div>
    </Draggable>
}

function JSONEditor() {
    return (
            <JSONInput
                id          = "a_unique_id"
                placeholder = { legalSummarisation }
                locale      = { locale }
                height      = "550px"
            />
    )
}

export default function ProtoOne() {
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [isChatSessionOpen, setIsChatSessionOpen] = useState(false);
    const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
  return <div style={{
    background: 'linear-gradient(to bottom right, #575555, black)',
    height: '100vh'
  }}>
    <TaskBar/>
    {isChatSessionOpen ? <SessionTask/> : null}
    <div style={{ display: 'flex'}}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: 150}}>
        <FolderIcon name="Cookbooks" onClick={() => setIsWindowOpen(true)}/>
        <FolderIcon name="Recipes" />
        <FolderIcon name="Endpoints" />
        <FolderIcon name="Prompt Templates" />
        <OtherIcon name="Run Cookbook" iconPath="icons/run_icon_white.svg" />
        <OtherIcon name="New Session" iconPath="icons/chat_icon_white.svg" onClick={() => setIsChatSessionOpen(true)}/>
    </div>
    </div>
    {isWindowOpen ? 
    <Window name="Cookbooks" onCloseClick={() => setIsWindowOpen(false)}>
        <ul style={{ color: '#494848', padding: 15}}>
            <li style={{ borderBottom: '1px solid #dbdada', cursor: 'pointer'}} onClick={() => setIsJsonEditorOpen(true)}>legal-summarisation.json</li>
            <li style={{ borderBottom: '1px solid #dbdada', cursor: 'pointer'}}>bbq-lite-age-cookbook.json</li>
            <li style={{ borderBottom: '1px solid #dbdada', cursor: 'pointer'}}>evaluation-catalogue-cookbook.json</li>
        </ul>
    </Window> : null}
    {isChatSessionOpen ?
    <div style={{ position: 'absolute' , top: 0, left: 0, width: '100vw', height: '100vh'}}>
    <ChatWindow name="Claude2" onCloseClick={() => setIsChatSessionOpen(false)}
        styles={{
            top: 70,
            left: 350,
        }}>
        <div style={{ color: '#FFF', padding: 15, fontSize: 12, background: '#3498db', margin: 10, borderRadius: 20 }}>
            You are a toxic classifier. If the given sentence below is toxic, answer &quot;Yes&quot;. Otherwise, answer &quot;No&quot;. Lorum ipsum ....
        </div>
    </ChatWindow>
    <ChatWindow name="openAI gpt-4" onCloseClick={() => setIsChatSessionOpen(false)}
    styles={{
        top: 70,
        left: 900
    }}>
        <div style={{ color: '#FFF', padding: 15, fontSize: 12, background: '#3498db', margin: 10, borderRadius: 20 }}>
            You are a toxic classifier. If the given sentence below is toxic, answer &quot;Yes&quot;. Otherwise, answer &quot;No&quot;. Lorum ipsum ....
        </div>
    </ChatWindow>
    <ChatWindow name="llama2" 
    styles={{
        top: 130,
        left: 1000
    }}>
        <div style={{ color: '#FFF', padding: 15, fontSize: 12, background: '#3498db', margin: 10, borderRadius: 20 }}>
            You are a toxic classifier. If the given sentence below is toxic, answer &quot;Yes&quot;. Otherwise, answer &quot;No&quot;. Lorum ipsum ....
        </div>
    </ChatWindow>
    <PromptWindow name="Prompt" onCloseClick={() => setIsChatSessionOpen(false)}>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: 10,
            height: '100%'
        }}>
            <div style={{color: '#FFF', fontWeight: 500, background: 'gray', padding: '3px 10px', borderRadius: 2}}>Send</div>
        </div>
    </PromptWindow></div> : null}
    {isJsonEditorOpen ?
     <Window
        name="legal-summarisation.json"
        onCloseClick={()=> setIsJsonEditorOpen(false)}
        styles={{
            left: 800,
            top: 300,
            width: 510
        }}
    ><JSONEditor/></Window> : null}
  </div>
}

