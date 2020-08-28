import React from 'react';
import { api } from '../../utils/Api';
import Card from '../card/Card';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import PopupWithForm from '../popupwithform/PopupWithForm';
import PopupWithImage from '../popupwithimage/PopupWithImage';

export default function Main(props) {
    // const [searchText, setSearchText] = React.useState('');
    // const [isLoading, setIsLoading] = React.useState(false);

    const [cards, setCards] = React.useState([]);

    const currentUser = React.useContext(CurrentUserContext);

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api.toggleLike(card._id, isLiked).then((newCard) => {
          const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
          setCards(newCards);
        });
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id).then(() => {
            setCards(cards.filter((c) => c._id !== card._id));
        });
    }

    React.useEffect(() => {
        // setIsLoading(true);
        api.getCardList()
            .then((res) => {
                setCards((cards) => [...cards, ...res]);
            }).catch((err) => {
                console.log(err);
            });

        }, []);

    return(
        <>
            <section className="profile">
                <div className="profile__avatar-elements">
                    <img className="profile__avatar" alt="User's profile." src={currentUser && currentUser.avatar} />
                    <button className="profile__avatar-button" aria-label="Update profile photo" onClick={props.onEditAvatar}></button>
                </div>
                <div className="profile__info-set">
                    <h1 className="profile__info profile__info_name">{currentUser && currentUser.name}</h1>
                    <p className="profile__info profile__info_description">{currentUser && currentUser.about}</p>
                </div>
                <button className="profile__edit-button" aria-label="Edit profile" onClick={props.onEditProfile}></button>
                <button className="profile__add-button" aria-label="Add new image" onClick={props.onAddPlace}></button>
            </section>
            <section className="grid">
                <ul className="grid__photos">
                </ul>
            </section>
            <div className="grid">
                <ul className="grid__photos">
                    {cards.map((card) => (
                        <Card key={card._id} card={card} onCardClick={props.onCardClick} onCardLike={handleCardLike} onCardDelete={handleCardDelete} />
                    ))}
                </ul>
            </div>
            <PopupWithForm name="avatar" title="Change profile picture" isOpen={props.isEditAvatarPopupOpen} onClose={props.onClosePopups} text="Save">
                <fieldset className="modal__fieldset">
                    <label>
                        {/* <Input placeholder={inputPlaceholder} onChange={inputChangeHandler}> */}
                        <input className="modal__input modal__input_avatar-link" id="avatar-link" name="avatar"
                            type="url" placeholder="Profile photo link" defaultValue="" required />
                        <span className="modal__input_error" id="avatar-link-error"></span>
                    </label>
                </fieldset>
            </PopupWithForm>
            <PopupWithForm name="profile" title="Edit profile" isOpen={props.isEditProfilePopupOpen} onClose={props.onClosePopups} text="Save">
                <fieldset className="modal__fieldset">
                    <label>
                        <input className="modal__input modal__input_name" name="name" type="text" placeholder="Name" minLength="2" maxLength="40" id="profile-name" />
                        <span className="modal__input_error" id="profile-name-error"></span>
                    </label>
                    <label>
                        <input className="modal__input modal__input_description" name="job" type="text" placeholder="About me" minLength="2" maxLength="200" id="profile-description" />
                        <span className="modal__input_error" id="profile-description-error"></span>
                    </label>
                </fieldset>
            </PopupWithForm>
            <PopupWithForm name="image" title="New place" isOpen={props.isAddPlacePopupOpen} onClose={props.onClosePopups} text="Create">
                <fieldset className="modal__fieldset">
                    <label>
                        <input className="modal__input modal__input_caption" id="image-caption" name="card-caption"
                            type="text" placeholder="Title" defaultValue="" minLength="1" maxLength="100" required />
                        <span className="modal__input_error" id="image-caption-error"></span>
                    </label>
                    <label>
                        <input className="modal__input modal__input_image-link" id="image-link" name="card-link"
                            type="url" placeholder="Image link" defaultValue="" required />
                        <span className="modal__input_error" id="image-link-error"></span>
                    </label>
                </fieldset>
            </PopupWithForm>
            <PopupWithForm name="delete" title="Are you sure?" isOpen={false} onClose={props.onClosePopups} text="Yes">
            </PopupWithForm>
            <PopupWithImage onClose={props.onClosePopups} card={props.selectedCard} />
        </>
        );
    }