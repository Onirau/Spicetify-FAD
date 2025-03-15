import React, { useState, useRef, useEffect } from "react";

interface SliderProps {
	value: number;
	onChange: (newProgress: number) => void;
	onChangeEnd: (newProgress: number) => void;
	onDragging: (isDragging: boolean) => void;
	orientation?: 'horizontal' | 'vertical';
	invert?: boolean;
    hide_pointer?: boolean;
	trackStyle?: React.CSSProperties;
	thumbStyle?: React.CSSProperties;
}

export const Slider: React.FC<SliderProps> = ({ value, onChange, onChangeEnd, onDragging, orientation = 'horizontal', invert = false, hide_pointer = false, trackStyle, thumbStyle }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const sliderBarRef = useRef<HTMLDivElement>(null);

	const [sliderWidth, setSliderWidth] = useState(0);
	const [clientAbsolute, setClientAbsolute] = useState(0);
	const [clientOffset, setClientOffset] = useState(0);

    const onMouseDown = (evt: MouseEvent) => {
        if (evt.button === 0) {
            console.log("Mouse Down:", evt);
            const sliderRect = sliderBarRef.current?.getBoundingClientRect();
            const absolute = orientation === "horizontal" ? evt.clientX : evt.clientY;
    
            // Calculate the absolute offset from the slider's start
            const offset =
                orientation === "horizontal"
                    ? evt.clientX - sliderRect!.left
                    : evt.clientY - sliderRect!.top;
    
            const sliderWidth =
                orientation === "horizontal"
                    ? sliderRect!.width
                    : sliderRect!.height;
    
            // Adjust for inverted sliders
            let newPosX = invert ? sliderWidth - offset : offset;
            newPosX = Math.min(Math.max(newPosX, 0), sliderWidth);
    
            const newPercentage = newPosX / sliderWidth;
    
            setClientAbsolute(absolute);
            setClientOffset(offset);
            setSliderWidth(sliderWidth);
    
            onChange(newPercentage * 100);
    
            setIsDragging(true);
            onDragging(true);
        }
    };

    const onMouseMove = (evt: MouseEvent) => {
        if (isDragging) {
            console.log("Mouse Move:", evt);
            const absolute = orientation === "horizontal" ? evt.clientX : evt.clientY;
            const moveX = absolute - clientAbsolute;
    
            let newPosX = clientOffset + moveX;
            if (invert) {
                newPosX = sliderWidth - newPosX;
            }
    
            newPosX = Math.min(Math.max(newPosX, 0), sliderWidth);
    
            const newPercentage = newPosX / sliderWidth;
    
            onChange(newPercentage * 100);
        }
    };
    

    const onMouseUp = (evt: MouseEvent) => {
        if (evt.button == 0 && isDragging) {
            console.log('Mouse Up:', evt);
            onChangeEnd(value);
            setIsDragging(false);
            onDragging(false);
        }
    }

	const setDragListener = () => {
        console.log('Setting drag listeners');
        sliderBarRef.current?.addEventListener('mousedown', onMouseDown)
        document.addEventListener('mouseup', onMouseUp)
        document.addEventListener('mousemove', onMouseMove)
    }

    const removeDragListener = () => {
        console.log('Removing drag listeners');
        sliderBarRef.current?.removeEventListener('mousedown', onMouseDown)
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMove)
    }

    useEffect(() => {
        console.log('useEffect setup');
        setDragListener();

        return () => {
            console.log('useEffect cleanup');
            removeDragListener();
        }
    }, [isDragging, clientAbsolute, clientOffset, sliderWidth]);

	return (
		<div id="slider-container"
			style={{ 
				height: orientation === 'horizontal' ? '20px' : '80%', 
				width: orientation === 'horizontal' ? '80%' : '20px', 
				position: 'relative',
			}}
			role="slider"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={100}
			tabIndex={0}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div ref={sliderBarRef}
				className={`${isDragging ? "dragging" : ""}`}
				style={{ 
					height: orientation === 'horizontal' ? '10px' : '100%', 
					width: orientation === 'horizontal' ? '100%' : '10px', 
					position: 'absolute', 
					transform: orientation === 'horizontal' ? 'translateY(-50%)' : 'translateX(50%)', 
					backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)', 
					borderRadius: '2.5px',
                    display: 'flex',
                    flexDirection: orientation === "vertical" ? 'column' : "row",
                    justifyContent: invert ? 'flex-end' : 'flex-start',
                    cursor: hide_pointer ? 'default' : 'pointer',
					...trackStyle
				}}
			>
				<div style={{ 
					width: orientation === 'horizontal' ? `${value}%` : '100%', 
					height: orientation === 'horizontal' ? '100%' : `${value}%`, 
					backgroundColor: isHovered ? '#1ed760' : '#1db954', 
					borderRadius: '2.5px', 
					transition: isDragging ? 'none' : 'width 1s linear, height 1s linear',
					...thumbStyle
				}}></div>
			</div>
		</div>
	);
};
