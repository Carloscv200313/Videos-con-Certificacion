import React from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';



export const Carrusel = () => {
    return (
        <Carousel autoplay className="h-screen" >
            {[1, 2, 3, 4].map((item, index) => (
                <div key={index} className="h-screen flex justify-center items-center bg-b">
                    <div className="relative w-full h-full flex justify-center items-center">
                        <Image
                            src={`/imgen_${item}.jpg`}
                            alt="Business meeting"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            ))}
        </Carousel>
    )
}