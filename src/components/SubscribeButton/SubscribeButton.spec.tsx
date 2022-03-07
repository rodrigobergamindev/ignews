import {render, screen} from '@testing-library/react'
import {mocked} from 'ts-jest/utils'
import {useSession, signIn} from 'next-auth/client'
import {fireEvent} from '@testing-library/dom'
import { SubscribeButton } from '.'
import { useRouter } from 'next/router'


jest.mock('next-auth/client')

jest.mock('next/router')

describe('SubscribeButton component', () => {

    it('renders correctly', () => {

        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])


        render (
            <SubscribeButton/>
        )

        expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
    })


    it('redirects user to sign in whe not authenticated', () => {
        const signInMocked = mocked(signIn)
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

      

        render(
            <SubscribeButton/>
        )

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })


    it('redirects to posts when user already has a subscription', () => {

        const useRouterMocked = mocked(useRouter)
        const useSessionMocked = mocked(useSession)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([
            {
                user: {
                name: 'John Doe',
                email: 'john.doe@example.com' 
            },
            activeSubscription: 'test-active-subscription',
            expires: 'test-expires'
            },
            false
        ])

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)
        
        render (
            <SubscribeButton/>
        )

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalledWith('/posts')
    })

})