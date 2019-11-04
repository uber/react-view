import * as React from 'react'
import { Card } from 'baseui/card'
import { Spinner } from 'baseui/spinner'
import { TYardProps } from './types'
import Yard from './yard'
//import {withRouter} from 'next/router';
import { useStyletron } from 'baseui'

const YardWrapper: React.FC<TYardProps & { queryStringName?: string }> = ({
  minHeight,
  queryStringName,
  ...restProps
}) => {
  const [useCss] = useStyletron()
  const placeholderCx = useCss({
    height: `${minHeight}px`,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })

  return (
    <Card>
      <Yard
        minHeight={minHeight}
        pathname="/"
        queryStringName={queryStringName}
        placeholderElement={() => {
          if (!minHeight) return null

          return (
            <div className={placeholderCx}>
              <Spinner size={minHeight > 50 ? 50 : minHeight} />
            </div>
          )
        }}
        {...restProps}
      />
    </Card>
  )
}

export default YardWrapper
