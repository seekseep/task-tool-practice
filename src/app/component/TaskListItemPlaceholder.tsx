"use client"

import { View, Flex, useTheme, Divider, Placeholder, Text } from "@aws-amplify/ui-react"

const TaskListItemPlaceholder = () => {
  const theme = useTheme()
  return (
    <View>
      <View
        paddingBlock={theme.tokens.space.small}
        paddingInline={theme.tokens.space.xs}>
        <Flex direction="row" gap={theme.tokens.space.xs}>
          <Placeholder grow={1} />
          <Placeholder grow={0.2} />
        </Flex>
      </View>
      <Divider />
    </View>
  )
}

export default TaskListItemPlaceholder
