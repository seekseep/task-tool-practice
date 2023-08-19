"use client"

import { FC, PropsWithChildren } from "react"
import { I18n,Amplify } from "aws-amplify"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Authenticator, translations } from '@aws-amplify/ui-react'

import config from '@/aws-exports'
import AuthenticatorHeader from "./AuthenticatorHeader"

Amplify.configure(config)
I18n.putVocabularies(translations);
I18n.setLanguage('ja');

const client = new QueryClient()

const Providers: FC<PropsWithChildren> =({ children }) => {
  return (
    <QueryClientProvider client={client}>
      <Authenticator components={{
        Header: AuthenticatorHeader
      }}>
        {children}
      </Authenticator>
    </QueryClientProvider>
  )
}

export default Providers
