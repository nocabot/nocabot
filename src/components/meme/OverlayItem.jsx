"use client";

import React, { useState } from "react";
import Transform from "react-free-transform";

/**
 * item: { id, type:'overlay'|'text', src?, text?, color?, font?,
 *         x, y, width, height, rotate }
 * isSelected: boolean
 * onSelect(id)
 * onUpdate(partial)
 * onDelete()
 */
export default function OverlayItem({
  item,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) {
  const [hovered, setHovered] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(item.id);
  };

  const handleTransformEnd = (transform) => {
    // transform => { rotate, translate:{x,y}, width, height, scaleX, scaleY }
    // finalize
    const { rotate, translate, width, height } = transform;
    onUpdate({
      rotate,
      x: translate.x,
      y: translate.y,
      width,
      height,
    });
  };

  return (
    <Transform
      translate={{ x: item.x, y: item.y }}
      rotate={item.rotate}
      width={item.width || 100}
      height={item.height || 100}
      resizable={true}
      rotatable={true}
      keepRatio={item.type === "overlay"} // For text, let them stretch
      scaleX={1}
      scaleY={1}
      onTransformEnd={handleTransformEnd}
      className="absolute top-0 left-0"
      // bounding box style
      // only show bounding if isSelected
      style={{
        outline: isSelected ? "2px dashed #6366f1" : "none",
        cursor: "pointer",
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-full h-full relative pointer-events-none">
        {item.type === "overlay" ? (
          <img
            src={item.src}
            alt="overlay"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="flex items-center justify-center text-center"
            style={{
              fontFamily: item.font,
              fontSize: "24px",
              color: item.color,
              width: "100%",
              height: "100%",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
            }}
          >
            {item.text}
          </div>
        )}

        {/* Delete button, show if hovered & selected */}
        {isSelected && hovered && (
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="
              absolute -top-5 -right-5 w-6 h-6
              rounded-full bg-red-600 text-white
              text-sm flex items-center justify-center
              shadow
            "
          >
            X
          </button>
        )}
      </div>
    </Transform>
  );
}