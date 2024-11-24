import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css"; // Ensure you have appropriate styles for the modal
import UserMember from "../User/UserMember"; // Import the User component
import { getOrderUsers } from "../../server";
const CardMembersModal = ({ sale_id, isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const respanse = await getOrderUsers(sale_id);

      setUsers(respanse);
    };

    fetchUsers();
  }, [sale_id]);

  console.log(users);

  if (isOpen) {
    return (
      <>
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={onClose}>
              &#215;
            </button>
            <h2>Пользователи вложившиеся в сбор</h2>
            <br />
            {users.length > 0 ? (
              users.map((user) => (
                <>
                  <UserMember
                    key={user.id} // Ensure to use a unique key
                    admin={user.admin}
                    quantity={user.quantity}
                    balance={user.balance}
                    first_name={user.first_name}
                    id={user.id}
                    phone_number={user.phone_number}
                    raiting={(parseFloat(user.raiting) || 0).toFixed(1)}
                  />
                  <br />
                </>
              ))
            ) : (
              <p>Пользователей не найдено.</p> // Message when no users are available
            )}
          </div>
        </div>
      </>
    );
  }
  return null;
};

// Define prop types for CardMembersModal
CardMembersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sale_id: PropTypes.number.isRequired,
};

export default CardMembersModal;
