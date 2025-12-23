import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.companyInfo}>
          <div className={styles.companyName}>도텍</div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>대표자</span>
              <span className={styles.value}>한철민</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>사업자등록번호</span>
              <span className={styles.value}>603-18-99267</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>통신판매신고</span>
              <span className={styles.value}>2020-수원장안-1017</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>주소</span>
              <span className={styles.value}>경기도 화성시 봉담읍 수영로 61-7, 201-601</span>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          Copyright ⓒ 도텍 Corp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
