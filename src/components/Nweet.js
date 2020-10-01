import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({nweetObj, isOwner}) => {
    const [editting, setEditting] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    // delete function
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        console.log(ok);
        if(ok){
            // delete nweet
            await dbService.doc(`nweets/${nweetObj.id}`).delete();

            // delete storage
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    }

    // edit fucntion
    const toggleEditting = () => setEditting(prev => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet
        });
        toggleEditting();
    };
    const onChange = (event) => {
        const {
            target : {value},
        } = event;
        setNewNweet(value);
    };

    return (
        <div>
            {
                editting ? 
                    <>
                        <form onSubmit={onSubmit}>
                            <input 
                                type="text" 
                                placeholder="Edit your nweet" 
                                value={newNweet} 
                                required
                                onChange={onChange}
                            />
                            <input
                                type="submit"
                                value="Update Nweet"
                            />
                        </form> 
                        <button onClick={toggleEditting}>Cancle</button>
                    </>
                : 
                    <>
                        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="200px" height="200px"/>}
                        <h4>{nweetObj.text}</h4>
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Nweet</button>
                                <button onClick={toggleEditting}>Edit Nweet</button>
                            </>
                        )}
                    </>
            }
        </div>
    )
};


export default Nweet;