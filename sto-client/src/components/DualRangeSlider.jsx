import React, { useState, useRef, useEffect } from 'react';
import './DualRangeSlider.css';

const DualRangeSlider = ({ min = 0, max = 1000000, value, onChange, label }) => {
  const [minVal, setMinVal] = useState(value.min);
  const [maxVal, setMaxVal] = useState(value.max);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  const getPercent = (val) => Math.round(((val - min) / (max - min)) * 100);

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal]);

  return (
    <div className="dual-range-slider">
      {label && (
        <label className="slider-label">
          {label}
        </label>
      )}
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          ref={minValRef}
          onChange={(e) => {
            const value = Math.min(+e.target.value, maxVal - 1);
            setMinVal(value);
          }}
          className="slider slider-left"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(e) => {
            const value = Math.max(+e.target.value, minVal + 1);
            setMaxVal(value);
          }}
          className="slider slider-right"
        />
        <div className="slider-track" />
        <div className="slider-range" ref={range} />
      </div>
      <div className="slider-values">
        <input
          type="number"
          className="slider-input"
          value={minVal}
          min={min}
          max={max}
          onChange={(e) => {
            const value = Math.min(Math.max(Number(e.target.value) || min, min), maxVal - 1);
            setMinVal(value);
          }}
        />
        <span className="slider-separator">-</span>
        <input
          type="number"
          className="slider-input"
          value={maxVal}
          min={min}
          max={max}
          onChange={(e) => {
            const value = Math.max(Math.min(Number(e.target.value) || max, max), minVal + 1);
            setMaxVal(value);
          }}
        />
      </div>
    </div>
  );
};

export default DualRangeSlider;

