"use client"

import { Heading, useTheme } from "@aws-amplify/ui-react"

const AuthenticatorHeader = () => {
  const theme = useTheme()
  return (
    <Heading
      level={4}
      textAlign="center"
      paddingBlock={theme.tokens.space.large}
      marginBlockEnd={theme.tokens.space.medium}>
      Task Manager
    </Heading>
  )
}

export default AuthenticatorHeader
