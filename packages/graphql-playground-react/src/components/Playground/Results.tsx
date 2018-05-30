import * as React from 'react'
import ageOfDate from './util/ageOfDate'
import { ResultViewer } from './ResultViewer'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getResponses } from '../../state/sessions/selectors'
import { List } from 'immutable'
import { styled, withProps } from '../../styled'
import { ResponseRecord } from '../../state/sessions/reducers'

export interface Props {
  setRef: (ref: any) => void
}

export interface ReduxProps {
  responses: List<ResponseRecord>
}

const defaultResponseRecord = new ResponseRecord({
  date: '',
  time: new Date(),
  resultID: 'default-id',
})

const Results: React.SFC<Props & ReduxProps> = ({ setRef, responses }) => {
  const response1 = responses.get(0) || defaultResponseRecord
  const isSubscription = responses.size > 1
  return (
    <ResultWindow innerRef={setRef} isSubscription={isSubscription}>
      {responses.size <= 1 ? (
        <Response key={'first'} isSubscription={isSubscription}>
          {responses.size > 1 &&
            response1.time && (
              <SubscriptionTime>
                <SubscriptionTimeText>
                  {ageOfDate(response1.time)}
                </SubscriptionTimeText>
              </SubscriptionTime>
            )}
          <ResultWrapper isSubscription={isSubscription}>
            <ResultViewer
              value={response1.date}
              isSubscription={isSubscription}
            />
          </ResultWrapper>
        </Response>
      ) : (
        responses.map(response => (
          <Response
            key={response.resultID || String(response.time)}
            isSubscription={isSubscription}
          >
            {responses.size > 1 &&
              response.time && (
                <SubscriptionTime>
                  <SubscriptionTimeText>
                    {ageOfDate(response.time)}
                  </SubscriptionTimeText>
                </SubscriptionTime>
              )}
            <ResultWrapper isSubscription={responses.size > 1}>
              <ResultViewer
                value={response.date}
                isSubscription={isSubscription}
              />
            </ResultWrapper>
          </Response>
        ))
      )}
    </ResultWindow>
  )
}

const mapStateToProps = createStructuredSelector({
  responses: getResponses,
})

export default connect(mapStateToProps)(Results)

const ResultWindow = withProps<ResultWrapperProps>()(styled.div)`
  flex: 1;
  height: ${props => (props.isSubscription ? 'auto' : '100%')};
  position: relative;
  overflow: ${props => (props.isSubscription ? 'auto' : 'visible')};
  max-height: none !important;

  .cm-string {
    color: rgb(41, 185, 115);
  }

  .cm-def {
    color: rgb(241, 143, 1);
  }

  .cm-property {
    color: rgb(51, 147, 220);
  }

  &::-webkit-scrollbar {
    display: none;
  }

  .CodeMirror {
    background: ${p => p.theme.colours.resultBackground};
  }
  .CodeMirror-gutters {
    cursor: col-resize;
  }
  .CodeMirror-foldgutter,
  .CodeMirror-foldgutter-open:after,
  .CodeMirror-foldgutter-folded:after {
    padding-left: 3px;
  }
`

const Response = withProps<ResultWrapperProps>()(styled.div)`
  position: relative;
  display: flex;
  flex: 1;
  height: ${props => (props.isSubscription ? `auto` : '100%')};
  flex-direction: column;
  &:not(:first-child):last-of-type {
    margin-bottom: 48px;
  }
`

const SubscriptionTime = styled.div`
  position: relative;
  height: 17px;
  margin-top: 12px;
  margin-bottom: 4px;
  &:before {
    position: absolute;
    width: 100%;
    content: '';
    top: 9px;
    left: 95px;
    border-top: 1px solid ${p => p.theme.colours.white20};
  }
`

const SubscriptionTimeText = styled.div`
  color: rgba(23, 42, 58, 1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  padding-left: 15px;
`

interface ResultWrapperProps {
  isSubscription: boolean
}

const ResultWrapper = withProps<ResultWrapperProps>()(styled.div)`
  display: flex;
  flex: 1;
  height: ${props => (props.isSubscription ? `auto` : '100%')};
  position: ${props => (props.isSubscription ? `relative` : 'static')};
`
