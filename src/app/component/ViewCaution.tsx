"use client"
import { FC } from "react";
import { Alert } from "@aws-amplify/ui-react";

const ViewCaution: FC = () => {
  return (
    <Alert
      title="注意"
      isDismissible
      variation="warning"
      dismissButtonLabel="同意する">
      このアプリケーションは技術検証を目的としてつくられています。登録されたデータは登録したユーザ自身のみが閲覧可能です。
      アプリケーションのへのログイン情報や登録されたデータは予告なく削除することがあります。
    </Alert>
  )
}

export default ViewCaution
