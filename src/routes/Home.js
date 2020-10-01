import Nweet from "components/Nweet";
import { v4 as uuidv4} from 'uuid';
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";

const Hoem = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    
    useEffect(() => {
        //getNweets();
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();

        let attachmentUrl = "";

        if(attachment !== ""){
            // make firebase storage route 
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);

            // img upload to firebase
            const respone = await attachmentRef.putString(attachment, "data_url");

            // get download url
            attachmentUrl = await respone.ref.getDownloadURL();
        }

        // nweet
        const nweetObj = {
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment(null);
    };

    const onChange = (event) => {
        const { target:{value}} = event;
        setNweet(value);
    };

    const onFileChange = (event) =>{
        // 불러온 파일 정보 가져오기
        const {
            target:{files},
        } = event;

        // 가져온 파일 정보 변수에 할당
        const theFile = files[0]; 

        // file API
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);

    } 

    // cancle to upload img
    const onClearAttachment = () => setAttachment(null);
    return (
    <div>
        <form onSubmit={onSubmit}>
            <input 
                value= {nweet} 
                onChange={onChange} 
                type="text" 
                placeholder="What's on your mind?" 
                maxLength={120}
            />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Nweet" />
            {
                attachment && 
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            }
        </form>
        <div>
            {nweets.map(nweet => (
                <Nweet 
                    key={nweet.id} 
                    nweetObj={nweet} 
                    isOwner={nweet.creatorId === userObj.uid}
                />
            ))}
        </div>
    </div>
    );
};
export default Hoem;