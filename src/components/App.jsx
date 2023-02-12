import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import { Section } from 'components/Section/Section';
import ContactForm from 'components/ContactForm/ContactForm';
import { ContactList } from 'components/ContactList/ContactList';
import { Filter } from 'components/Filter/Filter';

export const App = () => {
  const [contacts, setContacts] = useState(() => {
    const contacts = JSON.parse(localStorage.getItem('my-phonebook'));
    return contacts ? contacts : [];
  });
  
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('my-phonebook', JSON.stringify(contacts));
  }, [contacts]);

  const isDublicate = name => {
    const normalizedName = name.toLowerCase();
    const dublicateName = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizedName;
    });
    return Boolean(dublicateName);
  };

  const addContact = ({ name, number }) => {
    if (isDublicate(name)) {
      return alert(`${name} is already in contacts`);
    }

    setContacts(prevContacts => {
      const newContact = {
        id: nanoid(),
        name,
        number,
      };

      return [newContact, ...prevContacts];
    });
  };

  const removeContact = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const handleFilter = ({ target }) => setFilter(target.value);

  const getFilteredContacts = () => {
    if (!filter) {
      return contacts;
    }

    const normalizedFilter = filter.toLowerCase();
    const result = contacts.filter(({ name }) => {
      return name.toLowerCase().includes(normalizedFilter);
    });
    return result;
  };

  const filteredContacts = getFilteredContacts();
  const isContacts = Boolean(filteredContacts.length);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#010101',
      }}
    >
      <Section title="Phonebook">
        <ContactForm onSubmit={addContact} />
      </Section>

      <Section title="Contacts">
        <Filter handleChange={handleFilter} />
        {isContacts && (
          <ContactList
            removeContact={removeContact}
            contacts={filteredContacts}
          />
        )}
      </Section>
    </div>
  );
};
