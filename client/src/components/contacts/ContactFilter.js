import React, { useContext, useRef } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactFilter = () => {
  const contactContext = useContext(ContactContext);
  const { clearFilter, filterContacts } = contactContext;
  const text = useRef(""); //for simple forms..

  //   useEffect(() => {
  //     if (filtered === null) {
  // text.current.value =""
  //     } else {
  //     }
  //   }, []);

  const onChange = e => {
    if (text.current.value !== "") {
      filterContacts(e.target.value);
    } else {
      clearFilter();
    }
  };
  return (
    <form>
      <input
        type='text'
        onChange={onChange}
        ref={text}
        placeholder='Filter...'
      />
    </form>
  );
};

export default ContactFilter;
