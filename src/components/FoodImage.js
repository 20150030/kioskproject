import React from 'react';
import PropTypes from 'prop-types';

const FoodImage = ({ imageUrl, altText, style = { width: '100%', height: 'auto' } }) => {
  return (
    <img 
      src={imageUrl} 
      alt={altText} 
      style={style} 
    />
  );
};

// PropTypes로 props 유효성 검사
FoodImage.propTypes = {
  imageUrl: PropTypes.string.isRequired, // 필수: 이미지 URL
  altText: PropTypes.string.isRequired, // 필수: 대체 텍스트
  style: PropTypes.object,              // 선택: 스타일 객체
};

export default FoodImage;