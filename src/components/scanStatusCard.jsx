import AOS from 'aos';
import React, {useEffect} from 'react'
import "aos/dist/aos.css";

export default function ScanStatusCard({status}){

    function closeCard(){
        document.getElementById('statusCard').style.display = "none"
        location.reload();
    }

    useEffect(() => {
        AOS.init({
            duration: 2000
        });
        AOS.refresh();
    }, []);

    return(
        <div data-aos="fade-up" id='statusCard' className="text-center bg-white h-[100px] w-[100%] absolute bottom-[4vh] z-20 " >
            {status=="success"?<>
                <p className='text-center text-green-900  font-semibold my-4' >Scan successful</p>
                </>:<><p className='text-center text-red-900  font-semibold my-4' >Scan failed</p></>}
            <button onClick={closeCard}  className= "bg-black px-2 py-1  text-white">OK</button>
        </div>
    )
}