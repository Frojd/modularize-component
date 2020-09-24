# modularize-component
This is a quick and dirty script for turning non-css-in-js react components into modularized components
## What does it do?

It update your components like this:
```
-import './Article.scss';
+import styles from './Article.module.scss'

 import Picture from '../Picture/Picture';
 import Button from '../Button/Button';
@@ -12,41 +12,41 @@ import Byline from '../Byline/Byline';
 const Article = ({ headline, author, quote, card, imageRight, href }) => {
     return (
         <article
-            className={classNames('Article', {
-                'Article--ImageRight': imageRight,
+            className={classNames(styles['Article'], {
+                [styles['Article--ImageRight']]: imageRight,
             })}>
             {card && (
-                <div className="Article__Image">
+                <div className={styles["Article__Image"]}>
```

## Install
```bash
npm i -g modularize-component
```

## Usage
Transform a component:
```bash
modularize-component -c ./frontend/Article/
```

Transform all components in folder `components`:
```bash
find components -type d -depth 1 | xargs modularize-component -c
```


## Known shortages
The script is basicly just regexreplacing stuff, so you will have to test all components after a run. Fancyness like `{modifiers.map(x => "Article" ++ x)}` will leave corrupt output
