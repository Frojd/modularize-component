import React from 'react';

import i18n from '../../i18n';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Article.scss';

import Picture from '../Picture/Picture';
import Button from '../Button/Button';
import Byline from '../Byline/Byline';

const Article = ({ headline, author, quote, card, imageRight, href }) => {
    return (
        <article
            className={classNames('Article', {
                'Article--ImageRight': imageRight,
            })}>
            {card && (
                <div className="Article__Image">
                    <Picture {...card} size="large" />
                </div>
            )}

            <div
                className={classNames('Article__TextContainer', {
                    'Article__TextContainer--ImageRight': imageRight,
                })}>
                {headline && (
                    <header className="Article__Header">
                        <h1 className="Article__Headline">{headline}</h1>
                    </header>
                )}

                {author && (
                    <section className="Article__BylineContainer">
                        <Byline image={author.image} size="small" author={author} bylineColor="dark" />
                    </section>
                )}

                {quote && (
                    <section className="Article__Preamble">
                        <blockquote className="Article__Quote">
                            {quote}
                        </blockquote>
                    </section>
                )}

                {href && (
                    <div className="Article__LinkContainer">
                        <Button
                            href={href}
                            text={i18n.t('generic.readGuide')}
                            type="Tertiary"
                            icon="arrow"
                            iconSize="large"
                            buttonColor="pink"
                        />
                    </div>
                )}
            </div>
        </article>
    );
};

Article.propTypes = {
    imageRight: PropTypes.bool,
    author: PropTypes.object,
    quote: PropTypes.string,
    href: PropTypes.string,
    card: PropTypes.object,
    headline: PropTypes.string,
};

Article.defaultProps = {
    author: null,
    quote: null,
    href: null,
    card: null,
    headline: null,
    imageRight: false,
};

export default Article;
