
import styles from './style.module.css';

export default function ProductForm() {
  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Add New Product</h1>
        <form className={styles.form}>
          <div className={styles.group}>
            <label className={styles.label} htmlFor="name">
              Product Name
            </label>
            <input className={styles.input} type="text" id="name" name="name" />
          </div>
          <div className={styles.group}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <textarea className={styles.textarea} id="description" name="description" />
          </div>
          <div className={styles.group}>
            <label className={styles.label} htmlFor="price">
              Price
            </label>
            <input className={styles.input} type="number" id="price" name="price" />
          </div>
          <div className={styles.group}>
            <label className={styles.label} htmlFor="image">
              Image
            </label>
            <input className={styles.input} type="file" id="image" name="image" />
          </div>
          <button className={styles.button} type="submit">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
