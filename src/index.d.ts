type Image = {
  /** Date.now().toString() */
  id: string;

  /** The title for the image */
  title: string;

  /** Can either be base-64 string format or URL */
  src: string;

  /** Use `StorageUtil.transform(bytes)` */
  size: string;
};
