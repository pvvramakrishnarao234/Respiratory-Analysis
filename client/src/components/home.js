import React from "react";
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";
import Button from '@material-ui/core/Button';
import {useState} from "react"
import { IconButton,Container,Grow,Grid } from "@material-ui/core";
import { AppBar,Toolbar,Typography,CardActionArea} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const DropzoneAreaExample = () => {

    const [ data, setData] = useState({});
    const [audio_src, setAudio] = useState();
    const [detecteddis , setdetecteddis]=useState({});
    const [detectedres, setdetectedres] = useState({});
    var onFileChange = event => {
        setData( event.target.files[0] );  
        setAudio(URL.createObjectURL(event.target.files[0])); 
    };

    const headers = {
        "content-type": "multipart/form-data",
    };


    const detect = () => {
        const formData = new FormData();
        formData.append("file", data);
        var config = {
            method: 'post',
            url: ' https://5386-183-82-111-80.in.ngrok.io/object-to-json',
            headers: { 
                'Content-Type': 'multipart/form-data'
            },
            data : formData
        };
        axios(config)
        .then(function (response) {
            var res = response.data;
            console.log(JSON.stringify(response.data));
            var disease={
                "lstm_prediction" : res["disease_lstm"]["prediction"],
                "lstm_confidence" : res["disease_lstm"]["confidence"],
                "gru_prediction" : res["disease_gru"]["prediction"],
                "gru_confidence" : res["disease_gru"]["confidence"]
            }
            var res_rate={
                "lstm_prediction" : res["rr_lstm"]["prediction"],
                "lstm_confidence" : res["rr_lstm"]["confidence"],
                "gru_prediction" : res["rr_gru"]["prediction"],
                "gru_confidence" : res["rr_gru"]["confidence"]
            }
            setdetecteddis(disease);
            setdetectedres(res_rate);
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    return (
        <>
        <div>
            <AppBar position="static" color="secondary">
                <Toolbar>
                <Typography variant="h6" component="div" align="center" sx={{ flexGrow: 1 }}>
                    Respiratory Analysis
                </Typography>
                </Toolbar>
            </AppBar>
        </div>
        <div style={{
            "padding":"10vh"
        }}>
            <Typography variant="h4" component="div" align="center" sx={{ flexGrow: 1 }}>
                    Upload the Audio file
                </Typography>
        </div>
        <div style={{
            "width": "500px",
            "margin-left": "50vh",
            "display": "flex",
            "justify-content": "center",
        }}>
         <input type="file" onChange={onFileChange} />
         <br></br> &ensp; &ensp; &ensp;
        <Button  variant="contained" color="inherit" onClick={detect} >
            Upload!
        </Button>
        </div>
        <br></br> <br></br>
        <div style={{"justify-content": "center","margin-left": "50vh",}}>
            {audio_src && <audio src={audio_src} controls />}
        </div>
        <br></br> <br></br>
        {Object.keys(detecteddis)!=0 && 
        <div style={{"justify-content":"space-evenly"}}>
            <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1 }}>
                    Results
            </Typography>
            <br></br> <br></br>
            <Grow in>
            <Container>
            <Grid container justify-content="space-evenly" spacing={3}>
                <Grid container xs={12} sm={6} justifyContent="center">
                    <Card sx={{ minWidth: 345 }}>
                        <CardActionArea>
                            <CardContent>
                            <Typography gutterBottom align="center" variant="h5" component="div">
                                Disease Classification
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                LSTM
                            </Typography>
                            <Typography gutterBottom variant="p" component="div">
                                Disease :  {detecteddis.lstm_prediction} <br></br> <br></br>
                                Confidence: {detecteddis.lstm_confidence}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                GRU
                            </Typography>
                            <Typography gutterBottom variant="p" component="div">
                                Disease :  {detecteddis.gru_prediction} <br></br> <br></br>
                                Confidence: {detecteddis.gru_confidence}
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid container xs={12} sm={6} justifyContent="center">
                <Card sx={{ minWidth: 345 }} >
                        <CardActionArea>
                            <CardContent>
                            <Typography gutterBottom align="center" variant="h5" component="div">
                                Respiratory Rate
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                LSTM
                            </Typography>
                            <Typography gutterBottom variant="p" component="div">
                                Rate Prediction :  {detectedres.lstm_prediction} <br></br> <br></br>
                                Confidence: {detectedres.lstm_confidence}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                GRU
                            </Typography>
                            <Typography gutterBottom variant="p" component="div">
                                Rate Prediction :  {detectedres.gru_prediction} <br></br> <br></br>
                                Confidence: {detectedres.gru_confidence}
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
            </Container>
        </Grow>
            {/* {detected} */}
        </div>
        } 
        </>
    );
};

export default DropzoneAreaExample;



// {"disease_lstm":{"prediction":"URTI","confidence":"0.99943095"},"disease_gru":{"prediction":"Bronchiolitis ","confidence":"0.6304094"},"rr_lstm":{"prediction":"High","confidence":"0.99999094"},"rr_gru":{"prediction":"High","confidence":"0.9568108"}}