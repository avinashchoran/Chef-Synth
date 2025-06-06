import { useState, useEffect, useRef } from "react"
import { Sidebar } from 'primereact/sidebar';
import SideBarToggleIcon from "../assets/sidebar-icon.svg?react"
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
export default function ApiSideBar(props) {

    const [visible, setVisible] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const toast = useRef(null)

    useEffect(() => {
        const storedApiKey = localStorage.getItem("userApiKey");
        if (storedApiKey) {
            setApiKeyInput(storedApiKey);
        }
    }, []);

    function addApi(formData) {
        const userAPI = formData.get("apiInput");
        console.log(userAPI, userAPI);
        localStorage.setItem("userApiKey", userAPI)
        props.setApiKey(userAPI)
        if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'HuggingFace API Key saved!',
                life: 3000
            });
            setVisible(false);
        }


    }
    function clearApi() {
        localStorage.setItem("userApiKey", "");
        props.setApiKey("")
        setApiKeyInput("");
    }

    function toggleApiKeyVisibility() {
        setShowApiKey(prev => !prev);
    }

    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeClosedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-closed-icon lucide-eye-closed">
            <path d="m15 18-.722-3.25" />
            <path d="M2 8a10.645 10.645 0 0 0 20 0" />
            <path d="m20 15-1.726-2.05" />
            <path d="m4 15 1.726-2.05" />
            <path d="m9 18 .722-3.25" />
        </svg>
    );

    return (
        <>
            <Toast ref={toast} position="top-left" />
            <Sidebar visible={visible} onHide={() => setVisible(false)} className="side-bar">
                <h2>Settings</h2>
                <form className="enter-api-keys" action={addApi}>
                    <div className="input-group">
                        <FloatLabel>
                            <InputText id="apiInput" name="apiInput"
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                type={showApiKey ? "text" : "password"}
                            />
                            <label htmlFor="apiInput">HuggingFace API Key</label>

                        </FloatLabel>
                        <Button

                            className="p-button-secondary" // Use a different style for distinction, adjust as needed
                            onClick={toggleApiKeyVisibility}
                            type="button" // Important: Prevent form submission
                            icon={showApiKey ? <EyeIcon /> : <EyeClosedIcon />}
                            iconPos="right"
                        />
                    </div>
                    <div className="api-button-group">
                        <Button label="Submit" className="button-expand" />
                        <Button label="Clear" className="api-button button-expand" onClick={clearApi} type="button" />
                    </div>

                </form>
            </Sidebar>


            <div onClick={() => setVisible(true)} className=" side-bar-toggle" >
                <SideBarToggleIcon />
            </div>
        </>
    )
}