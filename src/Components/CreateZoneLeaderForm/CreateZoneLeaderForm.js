/*
ZONE LEADER FORM COMPONENT
Description: This component is to be used for creating
             a zone leader via a formik form. The fields
             to be included are on figma file.

     Author: Diego Alejandro Herrera Rojas
       Date: 01/06/21 
*/

import React, {useState, useEffect, useRef, useCallback} from 'react';

// Third party imports
import {useFormik} from 'formik';
import Modal from 'react-modal';
import * as Yup from 'yup';
import MapGL, {Marker} from 'react-map-gl';

// Form components
import FieldInput from './FieldInput';
import SelectInput from './SelectInput';
import FileInput from './FileInput';
import ProfileImageInput from './ProfileImageInput';

import blankProfile from './ProfileImageInput/assets/blankProfilePicture.png';
import mapPin from './assets/zoneLeaderPin.png'

import zoneLeaderStyles from './CreateZoneLeaderForm.module.css';

// DO NOT DELETE THIS
Modal.setAppElement('body');

// Change map display style here
const mapStyle = 'mapbox://styles/diegoherrera262/ckpossqqj09fy17npwfhqkadq'

const CreateZoneLeaderForm = (props) => {
    const {labelKeys, typeKeys, selectValues} = props;
    let {defaultInitialValues} = props;
    const valueKeys = Object.keys(defaultInitialValues);

    // include document properties on the initial values
    defaultInitialValues = {
        ...defaultInitialValues,
        frontID : {},
        backID : {},
        rut : {},
        bankData : {},
        contract : {}, 
        profileImage : null
    }

    // Split fields according to figma view design
    const leftFields = valueKeys.slice(0,Math.floor(valueKeys.length/2));
    const rightFields = valueKeys.slice(Math.floor(valueKeys.length/2));

    // Get current date for validation
    const today = new Date();

    // Ref for resetting profile image
    const profileImageRef = useRef();
    // Ref for resetting files
    const frontIdRef = useRef();
    const backIdRef = useRef();
    const rutRef = useRef();
    const bankDataRef = useRef();
    const contractRef = useRef();

    // Define state for showing error modal
    const [showErrorModal, setErrorShowModal] = useState(false);
    // Define state for showing confirmation modal
    const [showConfirmModal, setConfirmShowModal] = useState(false);
    // Define state for profile picture preview source
    const [profileImageSource, setProfileImageSource] = useState(blankProfile);
    // Define state for map zone identification
    const [zoneMarkerCoords, setZoneMarkerCoords] = useState({
        latitude : 4.68357,
        longitude : -74.14443
    });
    // Viewport state for map sone identification
    const [viewport, setViewport] = useState({
        width : 700,
        height : 300,
        latitude : 4.637764262457622,
        longitude : -74.08897789014473,
        zoom : 9
    });

    // Instantiate formik hook
    // for data management
    const formik = useFormik({
        /*set up initial values*/
        initialValues : defaultInitialValues,
        /*set up validation schema with yup*/
        validationSchema : Yup.object({
            name : Yup.string()
                .matches(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/, 
                    'Ingrese un nombre v??lido')
                .required('Campo requerido'),
            lastName : Yup.string()
                .matches(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,20}$/, 
                    'Ingrese un nombre v??lido')
                .required('Campo requerido'),
            documentId : Yup.number()
                .positive()
                .integer()
                .lessThan(9999999999, 'Ingrese n??mero de identificaci??n v??lido en Colombia')
                .moreThan(9999999, 'Ingrese n??mero de identificaci??n v??lido en Colombia')
                .required('Campo requerido'),
            address : Yup.string()
                .matches(/^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/,
                    'Ingrese una diercci??n v??lida')
                .required('Campo requerido'),
            leaderCode : Yup.number()
                .lessThan(999, 'Ingrese un c??digo num??rico de 3 cifras')
                .moreThan(100, 'Ingrese un c??digo num??rico de 3 cifras')
                .required('Campo requerido'),
            email : Yup.string()
                .email('Ingrese una direcci??n de email v??lida')
                .required('Campo requerido'),
            cellphone : Yup.number()
                .lessThan(9999999999, 'Ingrese un n??mero de celular v??lido en Colombia')
                .moreThan(999999999, 'Ingrese un n??mero de celular v??lido en Colombia')
                .required('Campo requerido'),
            zone : Yup.string()
                .matches(/^[a-zA-Z]{3,15}$/, 'Escoja una zona')
                .required('Campo requerido'),
            endContractDate : Yup.date()
                .min(today, 'Ingrese una fecha en el futuro')
                .required('Campo requerido')
        }),
        /*set up submit callback*/
        onSubmit : (values) => {
            setConfirmShowModal(true);
        }
    });

    // use Effect hook for generating profile image
    // source when updating input
    useEffect(() => {
        if (formik.values['profileImage']) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImageSource(reader.result);
            };
            reader.readAsDataURL(formik.values['profileImage']);
        } else {
            setProfileImageSource(blankProfile);
        }
    }, [formik])

    // Click handler for showing
    // alert modal
    const handleErrorClick = () => {
        // See if there are any errors
        const numErrors = Object.keys(formik.errors).length
        // see if the fields are empty
        let emptyField = false;
        for(let i = 0; i < valueKeys.length; i++){
            if(formik.values[valueKeys[i]] === ''){
                emptyField = true;
                break;
            }
        }
        const formIsNotRight =numErrors > 0 || emptyField 
        setErrorShowModal(formIsNotRight);
        setConfirmShowModal(!formIsNotRight);
    }

    const handleDragEnd = useCallback((event) => {
        setZoneMarkerCoords({
            longitude : event.lngLat[0],
            latitude : event.lngLat[1]
        });
    }, []);

    /*
    HERE IS WHERE THE SUBMIT
    ACTION IT TO BE HANDLED WITH
    THE BACKEND
    */
    const handleSubmitDataFromModal = () => {

        /*
        CONNECT WITH BACKEND HERE
        */

        console.log(formik.values);

        // reset form and hide modal
        formik.resetForm();
        formik.values = defaultInitialValues;
        // Reset file inputs
        profileImageRef.current.value = "";
        frontIdRef.current.value = "";
        backIdRef.current.value = "";
        rutRef.current.value = "";
        bankDataRef.current.value = "";
        contractRef.current.value = "";
        
        setConfirmShowModal(false);
    }

    return (
        <form onSubmit = {formik.handleSubmit}>
            <div
                className={zoneLeaderStyles['column-wrapper']}
            >
                <div className={zoneLeaderStyles['col2']}>
                    <ProfileImageInput 
                        src={profileImageSource}
                        parentRef={profileImageRef}
                        labelKey='Foto l??der de zona'
                        formHook={formik}
                    />
                    {
                        leftFields.map((field) => {
                            if (typeKeys[field] === 'select'){
                                return (
                                    <SelectInput
                                        key={field}
                                        fieldName={field}
                                        formHook={formik}
                                        labelKey={labelKeys[field]}
                                        optionVals={selectValues[field]}
                                    />
                                );
                            }
                            return (
                                <FieldInput 
                                    key={field} 
                                            fieldName={field} 
                                            formHook={formik}
                                            labelKey={labelKeys[field]}
                                    typeKey={typeKeys[field]} 
                                />
                            );
                        })
                    }
                    <div
                        className={zoneLeaderStyles['map-container']}
                    >
                        <MapGL
                            {...viewport}
                            onViewportChange={
                                (viewport) => setViewport(viewport)
                            }
                            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                            mapStyle={mapStyle}
                        >
                            <Marker
                                latitude={zoneMarkerCoords.latitude}
                                longitude={zoneMarkerCoords.longitude}
                                draggable
                                onDragEnd={handleDragEnd}
                            >
                                <img 
                                    width='5%'
                                    src={mapPin}
                                    alt=''
                                />
                            </Marker>
                        </MapGL>
                    </div>
                </div>
                <div className={zoneLeaderStyles['col2']}>
                    {
                        rightFields.map((field) => {
                                if (typeKeys[field] === 'select'){
                                    return (
                                        <SelectInput
                                            key={field}
                                            fieldName={field}
                                            formHook={formik}
                                            labelKey={labelKeys[field]}
                                            optionVals={selectValues[field]}
                                        />
                                    );
                                }
                                return (
                                    <FieldInput 
                                        key={field} 
                                        fieldName={field} 
                                        formHook={formik}
                                        labelKey={labelKeys[field]}
                                        typeKey={typeKeys[field]}
                                    />
                                );
                        })
                    }
                    
                    <h2> Documentos </h2>

                    <h3> Documento de identidad </h3>
                    <div className={zoneLeaderStyles['id-doc-wrapper']}>
                        <div className={zoneLeaderStyles['id-doc-col2']}>
                            <FileInput
                                fieldName='frontID'
                                formHook={formik}
                                parentRef={frontIdRef}
                                labelKey='Cara frontal'
                                accept='.pdf, image/*'
                            />
                        </div>
                        <div className={zoneLeaderStyles['id-doc-col2']}>
                            <FileInput 
                                fieldName='backID'
                                formHook={formik}
                                parentRef={backIdRef}
                                labelKey='Cara trasera'
                                accept='.pdf, image/*'
                            />
                        </div>
                    </div>

                    <h3> RUT </h3>
                    <FileInput 
                        fieldName='rut'
                        formHook={formik}
                        parentRef={rutRef}
                        labelKey='Ingrese documento'
                        accept='.pdf, .doc, .docx'
                    />

                    <h3> Certificaci??n bancaria </h3>
                    <FileInput
                        fieldName='bankData'
                        formHook={formik}
                        parentRef={bankDataRef}
                        labelKey='Ingrese documento'
                        accept='.pdf, .doc, .docx'
                    />

                    <h3> Contrato </h3>
                    <FileInput 
                        fieldName='contract'
                        formHook={formik}
                        parentRef={contractRef}
                        labelKey='Ingrese documento'
                        accept='.pdf, .doc, .docx'
                    />
                </div>
            </div>
            
            <button
                type='submit'
                onClick={handleErrorClick}
                className={zoneLeaderStyles['submit-button']}    
            >
                 Crear l??der
            </button>
            <Modal 
                isOpen={showConfirmModal}
                onRequestClose={() => {setConfirmShowModal(false)}}
                className={zoneLeaderStyles['Modal']}
                overlayClassName={zoneLeaderStyles['Overlay']}
            >
                <p align='center'>
                    Confirme creaci??n de l??der
                </p>
                <div
                    style={{textAlign : 'center'}}
                >
                    <button
                        onClick={handleSubmitDataFromModal}
                        className={zoneLeaderStyles['submit-button']}
                    >
                        Confirmar
                    </button>
                </div>
            </Modal>
            <Modal 
                isOpen={showErrorModal}
                onRequestClose={() => setErrorShowModal(false)}
                className={zoneLeaderStyles['Modal']}
                overlayClassName={zoneLeaderStyles['Overlay']}
            >
                <p align='center'>
                    Hay un error en algunos campos del
                    formulario. Revise las alertas.
                </p>
                <div
                    style={{textAlign : 'center'}}
                >
                    <button 
                        onClick={() => {setErrorShowModal(false)}}
                        className={zoneLeaderStyles['error-button']}
                    >
                        Cerrar
                    </button>
                </div>
            </Modal>
        </form>
    );
}

export default CreateZoneLeaderForm;