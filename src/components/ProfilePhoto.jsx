function ProfilePhoto({
  alt = 'Portrait of Suraj Singh',
  className = '',
  objectPosition = 'center 24%',
}) {
  return (
    <img
      src="/suraj-profile-photo.jpg"
      alt={alt}
      loading="lazy"
      className={className}
      style={{ objectPosition }}
    />
  )
}

export default ProfilePhoto
