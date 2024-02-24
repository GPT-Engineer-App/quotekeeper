import React, { useState } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Input, Stack, Text, Textarea, VStack, Heading, IconButton, Select, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

// Mock data for initial quotes
const initialQuotes = [
  {
    id: 1,
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "Motivation",
  },
  {
    id: 2,
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "Life",
  },
];

// Categories
const categories = ["Motivation", "Life", "Happiness"];

const Index = () => {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [view, setView] = useState("home"); // 'home', 'add', 'detail', 'edit'
  const [newQuote, setNewQuote] = useState({ text: "", author: "", category: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  const handleAddQuote = () => {
    setQuotes([
      ...quotes,
      {
        id: quotes.length + 1,
        ...newQuote,
      },
    ]);
    setNewQuote({ text: "", author: "", category: "" }); // Reset the form
    setView("home");
    toast({ title: "Quote added successfully!", status: "success", duration: 2000 });
  };

  const handleUpdateQuote = () => {
    setQuotes(quotes.map((q) => (q.id === currentQuote.id ? { ...q, ...newQuote } : q)));
    setNewQuote({ text: "", author: "", category: "" }); // Reset the form
    setView("home");
    toast({ title: "Quote updated successfully!", status: "success", duration: 2000 });
  };

  const handleDeleteQuote = (id) => {
    setQuotes(quotes.filter((q) => q.id !== id));
    setView("home");
    toast({ title: "Quote deleted successfully!", status: "error", duration: 2000 });
  };

  const handleSearch = () => {
    if (searchQuery) {
      setQuotes(quotes.filter((q) => q.text.toLowerCase().includes(searchQuery.toLowerCase()) || (q.author && q.author.toLowerCase().includes(searchQuery.toLowerCase()))));
    } else {
      setQuotes(initialQuotes); // Reset to initial quotes if search is cleared
    }
  };

  const QuoteCard = ({ quote }) => (
    <Flex p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md" direction="column" justifyContent="space-between">
      <Box>
        <Text mt={2} fontWeight="semibold" as="h3" lineHeight="tight" isTruncated>
          {quote.text}
        </Text>
        <Text mt={2}>- {quote.author || "Unknown"}</Text>
        <Text fontSize="sm" colorScheme="gray">
          Category: {quote.category}
        </Text>
      </Box>
      <Flex justifyContent="flex-end" mt={4}>
        <IconButton
          icon={<FaEdit />}
          onClick={() => {
            setCurrentQuote(quote);
            setNewQuote({ text: quote.text, author: quote.author, category: quote.category });
            setView("edit");
          }}
          aria-label="Edit Quote"
          mr={2}
        />
        <IconButton icon={<FaTrash />} onClick={() => handleDeleteQuote(quote.id)} aria-label="Delete Quote" />
      </Flex>
    </Flex>
  );

  const HomeView = () => (
    <VStack spacing={8}>
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Heading>Quotes Dashboard</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={() => setView("add")}>
          Add Quote
        </Button>
      </Flex>
      <Flex>
        <Input placeholder="Search quotes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} mr={2} />
        <IconButton icon={<FaSearch />} onClick={handleSearch} aria-label="Search Quotes" />
      </Flex>
      <Stack spacing={4} width="100%">
        {quotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </Stack>
    </VStack>
  );

  const AddEditForm = ({ isEditing = false }) => (
    <Container>
      <VStack spacing={5}>
        <Heading>{isEditing ? "Edit Quote" : "Add a New Quote"}</Heading>
        <FormControl isRequired>
          <FormLabel>Quote Text</FormLabel>
          <Textarea placeholder="Enter quote" value={newQuote.text} onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })} />
        </FormControl>
        <FormControl>
          <FormLabel>Author</FormLabel>
          <Input placeholder="Author's name (optional)" value={newQuote.author} onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })} />
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select placeholder="Select category" value={newQuote.category} onChange={(e) => setNewQuote({ ...newQuote, category: e.target.value })}>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button leftIcon={isEditing ? <FaEdit /> : <FaPlus />} colorScheme="teal" onClick={isEditing ? handleUpdateQuote : handleAddQuote}>
          {isEditing ? "Update Quote" : "Add Quote"}
        </Button>
        <Button variant="outline" onClick={() => setView("home")}>
          Cancel
        </Button>
      </VStack>
    </Container>
  );

  const renderView = () => {
    switch (view) {
      case "home":
        return <HomeView />;
      case "add":
        return <AddEditForm />;
      case "edit":
        return <AddEditForm isEditing />;
      default:
        return <HomeView />;
    }
  };

  return (
    <Container maxW="container.md" pt={10}>
      {renderView()}
    </Container>
  );
};

export default Index;
