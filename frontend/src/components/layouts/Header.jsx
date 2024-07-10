import {
  Button,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";

const Header = () => {
  let text = 5;
  return (
    <header>
      <HStack h={50} w={"full"} bg={"gray.500"}>
        <Image
          src="/images/needFix_logo.jpeg"
          alt="Needfix logo"
          boxSize={"100%"}
          borderRadius={"50%"}
          mx={2}
          w={"50"}
        />
        <Heading as={Link} to={"/"} fontSize={"1.2rem"} w={"full"}>
          RJ Cart
        </Heading>
        <InputGroup>
          <InputLeftAddon>
            <IoIosSearch />
          </InputLeftAddon>
          <Input
            type="search"
            //   w={{ base: 150, sm: 250, md: "full" }}
            //   mx={{ base: 0, md: 150 }}

            focusBorderColor="black"
          />
        </InputGroup>

        <HStack ms={"auto"}>
          <Button>Login</Button>
          <Button>Cart {text}</Button>
        </HStack>
      </HStack>
    </header>
  );
};

export default Header;
